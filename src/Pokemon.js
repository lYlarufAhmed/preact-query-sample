import {useQuery} from 'react-query'
import React from 'react'
import axios from 'axios'

async function fetchPokemon(page = 0, limit = 20) {
    const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${page * 20}&limit=${limit}`)
    return data
}

export default function Pokemon({queryClient}) {
    let [page, setPage] = React.useState(0)
    const {status, data, error, isFetching, isPreviousData} = useQuery(
        ['pokes', page],
        () => fetchPokemon(page),
        {keepPreviousData: true, staleTime: 5000}
    )
    // Prefetch the next page!
    React.useEffect(() => {
        if (data?.next) {
            queryClient.prefetchQuery(['pokes', page + 1], () =>
                fetchPokemon(page + 1)
            ).then()
        }
    }, [data, page, queryClient])
    return (
        <div className='Pokemon'>
            {status === 'loading' ? (
                <div>Loading...</div>
            ) : status === 'error' ? (
                <div>Error: {error.message}</div>
            ) : (
                // `data` will either resolve to the latest page's data
                // or if fetching a new page, the last successful page's data
                <div>
                    {data.results.map(poke => (
                        <p key={poke.name}>{poke.name}</p>
                    ))}
                </div>
            )}
            <div>Current Page: {page + 1}</div>
            <button
                onClick={() => setPage(old => Math.max(old - 1, 0))}
                disabled={page === 0}
            >
                Previous Page
            </button>
            {' '}
            <button
                onClick={() => {
                    setPage(old => (data?.next ? old + 1 : old))
                }}
                disabled={isPreviousData || !data?.next}
            >
                Next Page
            </button>
            {
                // Since the last page's data potentially sticks around between page requests,
                // we can use `isFetching` to show a background loading
                // indicator since our `status === 'loading'` state won't be triggered
                isFetching ? <span> Prefetching...</span> : null
            }{' '}
        </div>
    )


}