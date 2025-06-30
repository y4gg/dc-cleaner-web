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

interface Guild {
  id: string;
  name: string;
}

interface ServerTabProps {
  userGuilds: Guild[];
  isAuthenticated: boolean;
  leaveServer: (guildId: string) => void;
  selectedItems: {
    servers: string[];
    friends: string[];
    dms: string[];
  };
  handleSelectItem: (id: string, type: "servers") => void;
  handleDeleteSelected: () => void;
}

export function ServerTab({
  userGuilds,
  isAuthenticated,
  leaveServer,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
}: ServerTabProps) {
  const totalSelected =
    selectedItems.servers.length +
    selectedItems.friends.length +
    selectedItems.dms.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Servers</CardTitle>
        <CardDescription>
          Leave servers you no longer want to be part of.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userGuilds.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {userGuilds.map((guild) => (
              <div
                key={guild.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`server-${guild.id}`}
                    checked={selectedItems.servers.includes(guild.id)}
                    onCheckedChange={() => handleSelectItem(guild.id, "servers")}
                  />
                  <div>
                    <div className="font-medium">{guild.name}</div>
                    <div className="text-sm text-gray-500">ID: {guild.id}</div>
                  </div>
                </div>
                <Button
                  onClick={() => leaveServer(guild.id)}
                  variant="destructive"
                  size="sm"
                >
                  Leave
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isAuthenticated
              ? "No servers found"
              : "Please authenticate first"}
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
