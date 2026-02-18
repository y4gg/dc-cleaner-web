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
import { Loader2, User, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface Recipient {
  id: string;
  global_name: string;
  username: string;
  avatar?: string;
}

interface Channel {
  id: string;
  type: number;
  recipients: Recipient[];
  name?: string;
  icon?: string;
}

interface DmTabProps {
  userDms: Channel[];
  isAuthenticated: boolean;
  closeDm: (channelId: string) => void;
  selectedItems: {
    servers: string[];
    friends: string[];
    dms: string[];
  };
  handleSelectItem: (id: string, type: "dms") => void;
  handleDeleteSelected: () => void;
  isLoading: boolean;
  loadingItems: string[];
  handleSelectAll: (type: "dms", ids: string[]) => void;
  deletionProgress: {
    deleted: number;
    total: number;
  };
}

export function DmTab({
  userDms,
  isAuthenticated,
  closeDm,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
  isLoading,
  loadingItems,
  handleSelectAll,
  deletionProgress,
}: DmTabProps) {
  const selectionProgress =
    userDms.length > 0 ? (selectedItems.dms.length / userDms.length) * 100 : 0;
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

  const getGroupIconUrl = (channelId: string, iconHash?: string) => {
    if (iconHash) {
      return `https://cdn.discordapp.com/channel-icons/${channelId}/${iconHash}.png?size=64`;
    }
    return null;
  };

  return (
    <Card className={`flex flex-col ${isAuthenticated ? "h-full" : ""}`}>
      <CardHeader>
        <CardTitle>Open DMs</CardTitle>
        <CardDescription>
          Close any open DM channels you no longer need. This includes groups as well.
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isAuthenticated ? "flex-1 overflow-hidden" : ""}`}>
        {userDms.length > 0 ? (
          <div className={`space-y-2 ${isAuthenticated ? "h-full" : "max-h-96"} overflow-y-auto`}>
            {userDms.map((dm: Channel) => {
              const isGroupDm = dm.type === 3;
              const groupIconUrl = isGroupDm
                ? getGroupIconUrl(dm.id, dm.icon)
                : null;

              return (
                <div
                  key={dm.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={`dm-${dm.id}`}
                      checked={selectedItems.dms.includes(dm.id)}
                      onCheckedChange={() => handleSelectItem(dm.id, "dms")}
                    />
                    <div className="flex items-center gap-3">
                      {isGroupDm ? (
                        // Group DM display
                        <div className="relative w-10 h-10 aspect-square rounded-full overflow-hidden bg-gray-200 border border-gray-400 flex items-center justify-center">
                          {groupIconUrl ? (
                            <Image
                              src={groupIconUrl}
                              alt="Group icon"
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      ) : dm.recipients.length === 1 ? (
                        // Single DM display
                        <div className="relative w-10 h-10 aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {(() => {
                            const recipient = dm.recipients[0];
                            const avatarUrl = getAvatarUrl(
                              recipient.id,
                              recipient.avatar
                            );
                            return avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt={`${recipient.global_name}'s avatar`}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-400" />
                            );
                          })()}
                        </div>
                      ) : (
                        // Fallback for other types
                        <div className="relative w-10 h-10 aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {isGroupDm ? (
                            <>
                              {dm.name || "Group DM"} (
                              {dm.recipients
                                .map((r) => r.global_name)
                                .join(", ")}
                              )
                            </>
                          ) : (
                            <>
                              {dm.recipients[0].global_name} (@
                              {dm.recipients[0].username})
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">ID: {dm.id}</div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => closeDm(dm.id)}
                    variant="destructive"
                    size="sm"
                    disabled={loadingItems.includes(dm.id)}
                  >
                    {loadingItems.includes(dm.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Close"
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
              ? "No open DMs found"
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
          disabled={selectedItems.dms.length === 0 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Close Selected ({selectedItems.dms.length})
        </Button>
        <Progress
          value={isLoading ? deletionProgressValue : selectionProgress}
          className="w-1/2"
        />
        <Button
          onClick={() =>
            handleSelectAll(
              "dms",
              userDms.map((d) => d.id)
            )
          }
          variant="outline"
          disabled={userDms.length === 0}
        >
          {selectedItems.dms.length === userDms.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </CardFooter>
    </Card>
  );
}
