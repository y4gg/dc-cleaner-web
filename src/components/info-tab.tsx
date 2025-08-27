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
  return <Card>
      <CardHeader>
        <CardTitle>Questions and Answers</CardTitle>
        <CardDescription>
          Frequently asked questions and answers about the Discord Cleaner.
        </CardDescription>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How do you ensure the data is safe?
            </AccordionTrigger>
            <AccordionContent>
              Check out the network tab in your browser&apos;s developer
              tools. The data is never sent to any servers not by discord.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is this open source?</AccordionTrigger>
            <AccordionContent>
              Yes! You can find the source code on <Link href="https://github.com/y4gg/dc-cleaner-web">
                GitHub
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
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
