import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function InfoTab() {
  return <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle>Questions and Answers</CardTitle>
      <CardDescription>
        Frequently asked questions and answers about the Discord Cleaner.
      </CardDescription>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How do I get my Discord token?
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Open Discord in your browser, press CTRL SHIFT + I to open developer tools, go to the Console tab, and paste this script:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">
              {`(window.webpackChunkdiscord_app.push([
  [Symbol()],
  {},
  (o) => {
    for (let e of Object.values(o.c))
      try {
        if (!e.exports || e.exports === window) continue;
        e.exports?.getToken && (token = e.exports.getToken());
        for (let o in e.exports)
          e.exports?.[o]?.getToken &&
            "IntlMessagesProxy" !== e.exports[o][Symbol.toStringTag] &&
            (token = e.exports[o].getToken());
      } catch {}
  },
]),
  window.webpackChunkdiscord_app.pop(),
  token);`}
            </pre>
            <p className="mb-2">You may need to type allow pasting, and make sure to not copy the '</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How do you ensure the data is safe?
          </AccordionTrigger>
          <AccordionContent>
            Check out the network tab in your browser&apos;s developer
            tools. The data is never sent to any servers not by discord.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is this open source?</AccordionTrigger>
          <AccordionContent>
            Yes! You can find the source code on <Link href="https://github.com/y4gg/dc-cleaner-web">
              GitHub
            </Link>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Can I support the creator?</AccordionTrigger>
          <AccordionContent>
            Yes! Please considor leaving a star on the GitHub repo. Also,
            create issues if you have any feture requests or bugs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex gap-2 items-center justify-center mt-4">
        <Button variant={"link"} asChild>
          <a href="https://y4.gg">Developed by y4.gg</a>
        </Button>
        <Button variant={"ghost"} size={"icon"} className="size-8">
          <a href="https://github.com/y4gg/dc-cleaner-web">
            <Github />
          </a>
        </Button>
      </div>
    </CardHeader>
  </Card>;
}
