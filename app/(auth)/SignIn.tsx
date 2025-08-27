import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Login } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    const { email, password } = formData;
    if (formData.email === "" || formData.password === "") {
        return Alert.alert("Error", "Please fill all the fields");
    }
    setIsSubmitting(true);
    try {
      await Login({ email, password });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, email: text }))
        }
        label="Email"
        keyboardType="email-address"
        value={formData.email}
      />
      <CustomInput
        placeholder="Enter your password"
        value={formData.password}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry
      />
      <CustomButton
        title="Sign In"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Dont't have an account ?
        </Text>
        <Link href={"/(auth)/SignUp"} className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
