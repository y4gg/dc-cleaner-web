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

interface MuteDmsTabProps {
  userDms: Channel[];
  isAuthenticated: boolean;
  muteDm: (channelId: string) => Promise<boolean>;
  selectedItems: {
    servers: string[];
    friends: string[];
    dms: string[];
    mutes: string[];
    dmMutes: string[];
  };
  handleSelectItem: (id: string, type: "dmMutes") => void;
  handleMuteDmsSelected: () => void;
  isLoading: boolean;
  loadingItems: string[];
  handleSelectAll: (type: "dmMutes", ids: string[]) => void;
  deletionProgress: {
    deleted: number;
    total: number;
  };
}

export function MuteDmsTab({
  userDms,
  isAuthenticated,
  muteDm,
  selectedItems,
  handleSelectItem,
  handleMuteDmsSelected,
  isLoading,
  loadingItems,
  handleSelectAll,
  deletionProgress,
}: MuteDmsTabProps) {
  const selectionProgress =
    userDms.length > 0
      ? (selectedItems.dmMutes.length / userDms.length) * 100
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

  const getGroupIconUrl = (channelId: string, iconHash?: string) => {
    if (iconHash) {
      return `https://cdn.discordapp.com/channel-icons/${channelId}/${iconHash}.png?size=64`;
    }
    return null;
  };

  return (
    <Card className={`flex flex-col ${isAuthenticated ? "h-full" : ""}`}>
      <CardHeader>
        <CardTitle>Mute DMs</CardTitle>
        <CardDescription>
          Mute notifications from DM channels. This includes both direct messages and group DMs.
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
                      id={`dm-mute-${dm.id}`}
                      checked={selectedItems.dmMutes.includes(dm.id)}
                      onCheckedChange={() =>
                        handleSelectItem(dm.id, "dmMutes")
                      }
                    />

                    <div className="flex items-center gap-3">
                      {isGroupDm ? (
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
                    onClick={() => muteDm(dm.id)}
                    variant="destructive"
                    size="sm"
                    disabled={loadingItems.includes(dm.id)}
                  >
                    {loadingItems.includes(dm.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Mute"
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
            {isAuthenticated ? "No DMs found" : (
              <span>
                Please authenticate first. <a href="/" className="underline text-primary">Login here</a>
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          onClick={handleMuteDmsSelected}
          variant="destructive"
          disabled={selectedItems.dmMutes.length === 0 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mute Selected ({selectedItems.dmMutes.length})
        </Button>
        <Progress
          value={isLoading ? deletionProgressValue : selectionProgress}
          className="w-1/2"
        />
        <Button
          onClick={() =>
            handleSelectAll(
              "dmMutes",
              userDms.map((d) => d.id)
            )
          }
          variant="outline"
          disabled={userDms.length === 0}
        >
          {selectedItems.dmMutes.length === userDms.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </CardFooter>
    </Card>
  );
}
