import { SharedBootstrap } from "@/shared/infrastructure/bootstrap";

export const modules = [SharedBootstrap];

// Initialize modules
for (const Bootstrap of modules) {
  new Bootstrap().init();
}
