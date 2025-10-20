"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "app/src/lib/utils";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  className?: string;
}

export default function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className="flex space-x-1 rounded-2xl bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
              activeTab === tab.id
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#317873] to-[#49796b] rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: activeTab === tab.id ? 1 : 0,
              y: activeTab === tab.id ? 0 : 10,
              display: activeTab === tab.id ? "block" : "none",
            }}
            transition={{ duration: 0.3 }}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
