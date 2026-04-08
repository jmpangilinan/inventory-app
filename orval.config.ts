import { defineConfig } from "orval";

export default defineConfig({
  inventoryApi: {
    input: {
      target: "https://inventory-api-production-8530.up.railway.app/docs?api-docs.json",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: "src/api/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      override: {
        mutator: {
          path: "src/lib/axios.ts",
          name: "axiosInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
