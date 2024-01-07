"use client";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "@/firebase-config";
import { Resend } from 'resend';

const formSchema = z.object({
  firstName: z.string().min(5).max(50),
    email: z.string().email(),
  })

function FormComponent() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName:"",
          email: "",
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const docRef = await addDoc(collection(db, "users"), {
              email:values.email
            });
            const emailSend = await fetch('http://localhost:3000/api/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: values.email })
            });
            console.log("Document written with ID: ", docRef.id);
            if(emailSend.ok){
              console.log("Email sent");
            }
          } catch (e) {
            console.error("Error adding document: ", e);
          }
      }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default FormComponent
