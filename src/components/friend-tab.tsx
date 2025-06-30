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
}

export function FriendTab({
  userFriends,
  isAuthenticated,
  removeFriend,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
}: FriendTabProps) {
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
                >
                  Remove
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
      <CardFooter>
        <Button
          onClick={handleDeleteSelected}
          variant="destructive"
          disabled={totalSelected === 0}
        >
          Delete Selected ({totalSelected})
        </Button>
      </CardFooter>
    </Card>
  );
}
