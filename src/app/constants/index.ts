import { LucideIcon, Mail, Users, CalendarDays } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}
export interface Testimonial {
    quote: string;
    name: string;
    title: string;
    image: string;
  }
  
  export interface Testimonial {
    quote: string;
    name: string;
    title: string;
    image: string;
  }
  
  export const testimonials: Testimonial[] = [
    {
      quote:
        "Love how the Product Manager incorporates user suggestions. Could use faster feature rollouts, but great work!",
      name: "John Doe",
      title: "CEO",
      image: "/Pic001.jpg",
    },
    {
      quote:
        "The Designer's UI is stunning and intuitive. A few color options would make Taskify even better!",
      name: "Bob",
      title: "CTO",
      image: "/Pic002.png",
    },
    {
      quote:
        "Data Analyst's insights have improved Taskify a lot. More transparency on updates would be a plus!",
      name: "Johnson",
      title: "COO",
      image: "/Pic003.jpeg",
    },
    {
      quote: "Efficient, reliable, and easy to use. This has changed how we work!",
      name: "Alice",
      title: "Product Owner",
      image: "/Pic004.jpeg",
    },
    {
      quote: "A great tool for organizing tasks across multiple teams.",
      name: "Steve",
      title: "Project Manager",
      image: "/Pic005.avif",
    },
    {
      quote: "Simplifies planning and makes task tracking easy and fun.",
      name: "Emma",
      title: "Scrum Master",
      image: "/Pic006.jpg",
    },
  ];
  
  export const features: Feature[] = [
    {
      title: "Task Management",
      description:
        "Create, organize, and track tasks with our intuitive Kanban board interface.",
      icon: Mail,
    },
    {
      title: "Team Collaboration",
      description:
        "Assign tasks, add comments, and collaborate seamlessly with your team members.",
      icon: Users,
    },
    {
      title: "Calendar View",
      description:
        "Visualize deadlines and schedule tasks with our integrated calendar system.",
      icon: CalendarDays,
    },
  ];