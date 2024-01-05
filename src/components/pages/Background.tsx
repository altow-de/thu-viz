interface BackgroundProps {
  children: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
  return (
    <main className="min-h-screen flex justify-center bg-gradient-to-b from-danube-200 to-danube-800 relative py-8 sm:py-16 text-danube-950">
      <div className="absolute bottom-0 w-full z-1">
        <img className="z-0" src="waves.svg" />
      </div>
      {children}
    </main>
  );
};

export default Background;
