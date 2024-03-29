"use client";

import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase-config";

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().email(),
});

function FormComponent() {
  const [clicked, setClicked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function sleep(interval: number) {
    return new Promise((resolve) => setTimeout(resolve, interval));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setClicked(true);
    sleep(2000);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: values.email,
      });
      const emailSend = await fetch("http://localhost:3000/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, name: values.name }),
      });
      console.log("Document written with ID: ", docRef.id);
      if (emailSend.ok) {
        console.log("Email sent");
        form.reset();
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setClicked(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!clicked ? (
          <Button className="w-full" type="submit">
            Submit
          </Button>
        ) : (
          <div className="flex justify-center">
            <BeatLoader color="#000000" />
          </div>
        )}
      </form>
    </Form>
  );
}

export default FormComponent;
