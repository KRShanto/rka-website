import { Client, Account, Databases, ID } from "appwrite";

// Initialize the Appwrite client as documented in Appwrite docs
const client = new Client();

// Set endpoint and project ID from environment variables
// Log configuration for debugging
const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

console.log("Appwrite Configuration:", {
  endpoint,
  projectId: projectId,
});

client.setEndpoint(endpoint).setProject(projectId);

// Export the client for use in other files
export const appwrite = {
  client,
  account: new Account(client),
  databases: new Databases(client),
  id: ID,
};
