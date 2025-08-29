import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.ff.fastfood",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "68aed6b8002ee87c5619",
  bucketId: "68b1498a002741bcd84a",
  userCollectionId: "user",
  categoryCollectionId: "categories",
  menuCollelctionId: "menu",
  customizationCollectionId: "customizations",
  menuCustomizationsCollectionId: "menu_customizations",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    
    if (!newAccount) {
      throw new Error("Failed to create account");
    }
    await Login({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountID: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const Login = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) {
            throw new Error("No user logged in");
        }
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountID", [currentAccount.$id])
            ]
        )
        if (currentUser.total === 0) {
            throw new Error("User not found");
        }
        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string);
    }
}

export const getMenu = async ({category, query}: GetMenuParams) =>  {
  try {
    const queries: string[] = []
    if (category) queries.push(Query.equal('categories', category))
    if (query) queries.push(Query.search('name', query))

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollelctionId,
      queries
    )
    return menus.documents
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCategories = async () =>  {
  try {

    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
    )
    return categories.documents
  } catch (error) {
    throw new Error(error as string)
  }
}
