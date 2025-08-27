import { CreateUserPrams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.ff.fastfood",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "68aed6b8002ee87c5619",
  userCollectionId: "user",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
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
