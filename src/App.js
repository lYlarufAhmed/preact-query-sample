import {QueryClient, QueryClientProvider} from 'react-query'
import Pokemon from './Pokemon';
const queryClient = new QueryClient()
function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
     <Pokemon queryClient={queryClient}/>
    </QueryClientProvider>
  );
}

export default App;
