import { Account, Client, ID, Query, TablesDB } from "react-native-appwrite";

let client: Client;

const appwriteEndpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

client = new Client();
client.setEndpoint(appwriteEndpoint!).setProject(appwriteProjectId!); // Your Project ID

export const account = new Account(client);
export const tablesDB = new TablesDB(client);

export const METRICS_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
export const METRICS_TABLE_ID = "metrics";

//track searches made by the user
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: METRICS_DATABASE_ID!,
      tableId: METRICS_TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];

      await tablesDB.updateRow({
        databaseId: METRICS_DATABASE_ID!,
        tableId: METRICS_TABLE_ID,
        rowId: existingMovie.$id,
        data: {
          count: existingMovie.count + 1,
        },
      });
    } else {
      await tablesDB.createRow({
        databaseId: METRICS_DATABASE_ID!,
        tableId: METRICS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie?.id,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: METRICS_DATABASE_ID!,
      tableId: METRICS_TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
