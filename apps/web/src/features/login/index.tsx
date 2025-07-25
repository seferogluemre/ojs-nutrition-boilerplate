import { Card, CardContent } from "#components/ui/card.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#components/ui/tabs.js";
import { useState } from "react";
import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

export default function Login() {
  const [activeTab, setActiveTab] = useState<string>("signin");

  return (
    <>
      <div className="my-16 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="text-sm font-medium">
                  Giriş Yap
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-medium">
                  Üye Ol
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <SignInForm />
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <SignUpForm onSwitchToSignIn={() => setActiveTab("signin")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
