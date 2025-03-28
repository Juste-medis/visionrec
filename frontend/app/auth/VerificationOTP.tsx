import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const VerificationCodePage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Récupération de l'email passé via les params
  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params]);

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://visionrec.adidome.com/auth/confirm/passwordchange",
        {
          email: email.trim(),
          reset_code: resetCode.trim(),
          new_password: newPassword.trim(),
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Succès",
          "Votre mot de passe a été réinitialisé avec succès."
        );
        router.push("/auth/Connection"); // Redirige vers la page de connexion
      } else {
        throw new Error("Erreur lors de la réinitialisation du mot de passe.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Vérification du code
      </Text>
      <Text>Code de réinitialisation :</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Entrez le code de réinitialisation"
        value={resetCode}
        onChangeText={setResetCode}
      />
      <Text>Nouveau mot de passe :</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Entrez votre nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={loading}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          alignItems: "center",
          borderRadius: 5,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Réinitialiser le mot de passe
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() => router.push("/auth/Connection")}
          className="mt-4"
        >
          <Text className="text-blue-600 text-center">
            Retour à la connexion
          </Text>
        </TouchableOpacity>
    </View>
  );
};

export default VerificationCodePage;
