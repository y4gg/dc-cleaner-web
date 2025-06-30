import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    discriminator: string;
  };
}

interface FriendTabProps {
  userFriends: Relationship[];
  isAuthenticated: boolean;
  removeFriend: (userId: string) => void;
  selectedItems: {
    servers: string[];
    friends: string[];
    dms: string[];
  };
  handleSelectItem: (id: string, type: "friends") => void;
  handleDeleteSelected: () => void;
  isLoading: boolean;
  loadingItems: string[];
  handleSelectAll: (type: "friends", ids: string[]) => void;
  deletionProgress: {
    deleted: number;
    total: number;
  };
}

export function FriendTab({
  userFriends,
  isAuthenticated,
  removeFriend,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
  isLoading,
  loadingItems,
  handleSelectAll,
  deletionProgress,
}: FriendTabProps) {
  const selectionProgress =
    userFriends.length > 0
      ? (selectedItems.friends.length / userFriends.length) * 100
      : 0;

  const deletionProgressValue =
    deletionProgress.total > 0
      ? (deletionProgress.deleted / deletionProgress.total) * 100
      : 0;

  const totalSelected =
    selectedItems.servers.length +
    selectedItems.friends.length +
    selectedItems.dms.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Friends</CardTitle>
        <CardDescription>
          Remove friends you no longer want to keep.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userFriends.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {userFriends.map((friend: Relationship) => (
              <div
                key={friend.user.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`friend-${friend.user.id}`}
                    checked={selectedItems.friends.includes(friend.user.id)}
                    onCheckedChange={() =>
                      handleSelectItem(friend.user.id, "friends")
                    }
                  />
                  <div>
                    <div className="font-medium">
                      {friend.user.username}#{friend.user.discriminator}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {friend.user.id}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => removeFriend(friend.user.id)}
                  variant="destructive"
                  size="sm"
                  disabled={loadingItems.includes(friend.user.id)}
                >
                  {loadingItems.includes(friend.user.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isAuthenticated ? "No friends found" : "Please authenticate first"}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          onClick={handleDeleteSelected}
          variant="destructive"
          disabled={selectedItems.friends.length === 0 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete Selected ({selectedItems.friends.length})
        </Button>
        <Progress
          value={isLoading ? deletionProgressValue : selectionProgress}
          className="w-1/2"
        />
        <Button
          onClick={() =>
            handleSelectAll(
              "friends",
              userFriends.map((f) => f.user.id)
            )
          }
          variant="outline"
          disabled={userFriends.length === 0}
        >
          {selectedItems.friends.length === userFriends.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </CardFooter>
    </Card>
  );
}
