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
import { Loader2, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface Guild {
  id: string;
  name: string;
  icon?: string;
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

  const getServerIconUrl = (guildId: string, iconHash?: string) => {
    if (iconHash) {
      return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=64`;
    }
    return null;
  };

  return (
    <Card className={`flex flex-col ${isAuthenticated ? "h-full" : ""}`}>
      <CardHeader>
        <CardTitle>Leave Servers</CardTitle>
        <CardDescription>
          Leave servers you no longer want to be part of.
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isAuthenticated ? "flex-1 overflow-hidden" : ""}`}>
        {userGuilds.length > 0 ? (
          <div className={`space-y-2 ${isAuthenticated ? "h-full" : "max-h-96"} overflow-y-auto`}>
            {userGuilds.map((guild) => {
              const iconUrl = getServerIconUrl(guild.id, guild.icon);
              
              return (
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
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt={`${guild.name} server icon`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <Hash className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{guild.name}</div>
                        <div className="text-sm text-gray-500">ID: {guild.id}</div>
                      </div>
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
              );
            })}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isAuthenticated
              ? "No servers found"
              : (
                <span>
                  Please authenticate first. <a href="/" className="underline text-primary">Login here</a>
                </span>
              )}
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
          Leave Selected ({selectedItems.servers.length})
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
