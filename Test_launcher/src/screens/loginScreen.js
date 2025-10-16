import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = () => {
    if (!email.trim()) {
      setErro("Email é obrigatório");
      return false;
    }

    if (!validarEmail(email)) {
      setErro("Email inválido");
      return false;
    }

    if (!senha.trim()) {
      setErro("Senha é obrigatória");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setErro("");
    setCarregando(true);

    if (!validarFormulario()) {
      setCarregando(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      // Navigation will be handled by auth state change in AppNavigator
    } catch (error) {
      console.error("Erro no login:", error);
      if (error.code === 'auth/user-not-found') {
        setErro("Usuário não encontrado");
      } else if (error.code === 'auth/wrong-password') {
        setErro("Senha incorreta");
      } else if (error.code === 'auth/invalid-email') {
        setErro("Email inválido");
      } else if (error.code === 'auth/user-disabled') {
        setErro("Conta desabilitada");
      } else if (error.code === 'auth/too-many-requests') {
        setErro("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setErro("Erro no login. Verifique suas credenciais.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!carregando}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        editable={!carregando}
      />

      <TouchableOpacity
        style={[styles.loginButton, carregando && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={carregando}
      >
        <Text style={styles.loginButtonText}>
          {carregando ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 5 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
  loginButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center"
  },
  loginButtonDisabled: {
    backgroundColor: "#6c757d",
    opacity: 0.6
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
