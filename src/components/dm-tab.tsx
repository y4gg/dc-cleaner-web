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

interface Recipient {
  id: string;
  username: string;
  discriminator: string;
}

interface Channel {
  id: string;
  type: number;
  recipients: Recipient[];
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
    userDms.length > 0
      ? (selectedItems.dms.length / userDms.length) * 100
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
        <CardTitle>Open DMs</CardTitle>
        <CardDescription>
          Close any open DM channels you no longer need. Warning: This includes leaving groups as well.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userDms.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {userDms.map((dm: Channel) => (
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
                  <div>
                    <div className="font-medium">
                      {dm.recipients.map((r) => r.username).join(", ")}
                    </div>
                    <div className="text-sm text-gray-500">ID: {dm.id}</div>
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
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isAuthenticated
              ? "No open DMs found"
              : "Please authenticate first"}
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
          Delete Selected ({selectedItems.dms.length})
        </Button>
        <Progress
          value={isLoading ? deletionProgressValue : selectionProgress}
          className="w-1/2"
        />
        <Button
          onClick={() => handleSelectAll("dms", userDms.map((d) => d.id))}
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