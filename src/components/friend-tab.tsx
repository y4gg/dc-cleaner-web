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
import { Loader2, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar?: string;
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

  const getAvatarUrl = (userId: string, avatarHash?: string) => {
    if (avatarHash) {
      return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=64`;
    }
    return null;
  };

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
            {userFriends.map((friend: Relationship) => {
              const avatarUrl = getAvatarUrl(friend.user.id, friend.user.avatar);
              
              return (
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
                    
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={`${friend.user.global_name}'s avatar`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium">
                        {friend.user.global_name} (@{friend.user.username})
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {friend.user.id}
                        </div>
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
              );
            })}
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
