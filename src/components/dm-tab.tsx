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
}

export function DmTab({
  userDms,
  isAuthenticated,
  closeDm,
  selectedItems,
  handleSelectItem,
  handleDeleteSelected,
}: DmTabProps) {
  const totalSelected =
    selectedItems.servers.length +
    selectedItems.friends.length +
    selectedItems.dms.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open DMs</CardTitle>
        <CardDescription>
          Close any open DM channels you no longer need.
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
                >
                  Close
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