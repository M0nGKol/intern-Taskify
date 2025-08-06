import React from "react";
import { features, Feature } from "@/app/constants";

const Features = () => {
  return (
    <section className="flex flex-col items-center text-center rounded-lg">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2>
            Streamline your workflow with our powerful task management platform.
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Organize projects, collaborate with teams, and boost productivity.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature: Feature, index: number) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-[#113F67]"
              >
                <Icon className="h-12 w-12 text-[#113F67] mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-[#113F67]">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
