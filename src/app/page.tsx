"use client";

import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools: { title: string; description: string; href: string }[] = [
  {
    title: "Leave Servers",
    description: "Bulk leave Discord servers you no longer want to be part of.",
    href: "/servers",
  },
  {
    title: "Server Mutes",
    description: "Mute multiple Discord servers at once to reduce notifications.",
    href: "/mutes",
  },
  {
    title: "Friends",
    description: "Remove multiple friends from your Discord friends list.",
    href: "/friends",
  },
  {
    title: "Friend Mutes",
    description: "Mute multiple friends to stop receiving notifications from them.",
    href: "/friend-mutes",
  },
  {
    title: "DMs",
    description: "Close multiple direct message channels to clean up your DM list.",
    href: "/dms",
  },
  {
    title: "Q&A",
    description: "Q&A about discord cleaner",
    href: "/info",
  },
];

export default function Page() {
  return (
    <PageLayout>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.href} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={tool.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
