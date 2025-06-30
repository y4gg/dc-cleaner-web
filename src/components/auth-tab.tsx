import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthTabProps {
  isAuthenticated: boolean;
  token: string;
  setToken: (token: string) => void;
  isLoading: boolean;
  handleTokenSave: () => void;
  handleLogout: () => void;
}

export function AuthTab({
  isAuthenticated,
  token,
  setToken,
  isLoading,
  handleTokenSave,
  handleLogout,
}: AuthTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Token</CardTitle>
        <CardDescription>
          Enter your Discord token to clean up your account. This runs completely
          in your browser - your token never touches our servers.
        </CardDescription>
      </CardHeader>
      {!isAuthenticated ? (
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="discord-token">Discord Token</Label>
            <Input
              id="discord-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Discord token"
            />
            <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded">
              <strong>Security Note:</strong> Your token is stored only in your
              browser&apos;s cookies and is never sent to our servers. All Discord
              API calls happen directly from your browser to Discord.
            </div>
          </div>
        </CardContent>
      ) : null}
      <CardFooter>
        {!isAuthenticated ? (
          <Button onClick={handleTokenSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Verifying..." : "Verify and save"}
          </Button>
        ) : (
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
