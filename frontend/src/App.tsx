import { ThemeProvider } from "./app/providers/ThemeProvider";
import { MotionProvider } from "./app/providers/MotionProvider";
import { SmoothScrollProvider } from "./app/providers/SmoothScrollProvider";
import { Nav } from "./components/layout/Nav";
import { Grain } from "./components/decor/Grain";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Hero } from "./sections/Hero/Hero";

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <SmoothScrollProvider>
          <Grain />
          <Nav />
          <main>
            <Hero />
          </main>
          <ThemeSwitcher />
        </SmoothScrollProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
