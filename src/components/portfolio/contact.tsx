import { Section } from "./section";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Send, Calendar, MessageSquare, Phone } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  projectType: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a bit more").max(1000),
});
type FormData = z.infer<typeof schema>;

export function Contact() {
  const { content } = usePortfolioContent();
  const { contact } = content;
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("contact:", data);
    toast.success("Message sent! I'll get back within 24h.");
    reset();
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={<>Let's <span className="gradient-primary-text">build</span> something.</>}
      description="Full-time roles, freelance projects, or a quick technical chat — I'd love to hear from you."
      floatingIcons={[
        { Icon: Mail, className: "top-14 left-[8%] h-10 w-10", delay: 0 },
        { Icon: MessageSquare, className: "top-24 right-[10%] h-11 w-11", delay: 1.3 },
        { Icon: Phone, className: "bottom-20 left-[14%] h-9 w-9", delay: 2.5 },
        { Icon: Send, className: "bottom-16 right-[14%] h-9 w-9", delay: 3.6 },
        { Icon: Calendar, className: "top-1/2 left-1/2 h-8 w-8", delay: 2.9 },
      ]}
    >
      <div className="grid md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-primary/10 text-primary"><Mail className="h-4 w-4" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium text-sm">{contact.email}</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg grid place-items-center bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="font-medium text-sm">{contact.location}</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="text-sm font-semibold mb-2">Prefer a call?</div>
            <p className="text-xs text-muted-foreground mb-4">Book a 30-min intro to discuss your project.</p>
            <Button variant="outline" className="w-full rounded-full" asChild>
              <a href={contact.calendarUrl}><Calendar className="mr-2 h-4 w-4" /> Schedule Meeting</a>
            </Button>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-3 glass-card p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="mb-2 inline-block">Name</Label>
              <Input id="name" placeholder="Jane Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 inline-block">Email</Label>
              <Input id="email" type="email" placeholder="jane@company.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="company" className="mb-2 inline-block">Company</Label>
              <Input id="company" placeholder="Acme Inc." {...register("company")} />
            </div>
            <div>
              <Label htmlFor="projectType" className="mb-2 inline-block">Project Type</Label>
              <Input id="projectType" placeholder="Backend / Full-time / MVP" {...register("projectType")} />
            </div>
            <div>
              <Label htmlFor="budget" className="mb-2 inline-block">Budget</Label>
              <Input id="budget" placeholder="$5k – $15k" {...register("budget")} />
            </div>
            <div>
              <Label htmlFor="timeline" className="mb-2 inline-block">Timeline</Label>
              <Input id="timeline" placeholder="ASAP / 4 weeks" {...register("timeline")} />
            </div>
          </div>
          <div>
            <Label htmlFor="message" className="mb-2 inline-block">Message</Label>
            <Textarea id="message" rows={5} placeholder="Tell me about your project..." {...register("message")} />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground border-0 glow-primary hover:opacity-90">
              <Send className="mr-2 h-4 w-4" /> {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" asChild>
              <a href={`mailto:${contact.email}`}>Hire Me Directly</a>
            </Button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}