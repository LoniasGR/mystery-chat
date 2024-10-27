import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "@/views/Chat";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Chat />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Root;
