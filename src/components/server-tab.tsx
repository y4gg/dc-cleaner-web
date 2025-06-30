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
  isLoading: boolean;
  loadingItems: string[];
  handleSelectAll: (type: "servers", ids: string[]) => void;
  deletionProgress: {
    deleted: number;
    total: number;
  };
}

export function ServerTab({
  userGuilds,
  isAuthenticated,
  leaveServer,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
  isLoading,
  loadingItems,
  handleSelectAll,
  deletionProgress,
}: ServerTabProps) {
  const selectionProgress =
    userGuilds.length > 0
      ? (selectedItems.servers.length / userGuilds.length) * 100
      : 0;

  const deletionProgressValue =
    deletionProgress.total > 0
      ? (deletionProgress.deleted / deletionProgress.total) * 100
      : 0;

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
                  disabled={loadingItems.includes(guild.id)}
                >
                  {loadingItems.includes(guild.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Leave"
                  )}
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
      <CardFooter className="flex items-center justify-between">
        <Button
          onClick={handleDeleteSelected}
          variant="destructive"
          disabled={selectedItems.servers.length === 0 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete Selected ({selectedItems.servers.length})
        </Button>
        <Progress
          value={isLoading ? deletionProgressValue : selectionProgress}
          className="w-1/2"
        />
        <Button
          onClick={() => handleSelectAll("servers", userGuilds.map((g) => g.id))}
          variant="outline"
          disabled={userGuilds.length === 0}
        >
          {selectedItems.servers.length === userGuilds.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </CardFooter>
    </Card>
  );
}
