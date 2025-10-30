import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    return senha.length >= 4;
  };

  const validarFormulario = () => {
    if (!nomeUsuario.trim()) {
      setErro("Nome de usuário é obrigatório");
      return false;
    }

    if (!validarEmail(email)) {
      setErro("Email inválido");
      return false;
    }

    if (!validarSenha(senha)) {
      setErro("A senha deve ter pelo menos 4 caracteres");
      return false;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setErro("");

    if (!validarFormulario()) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      // Navigation will be handled by auth state change in AppNavigator
      // But to ensure, navigate explicitly
      navigation.navigate("MainTabs");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErro("Este email já está cadastrado");
      } else if (error.code === 'auth/weak-password') {
        setErro("A senha é muito fraca");
      } else if (error.code === 'auth/invalid-email') {
        setErro("Email inválido");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 4 caracteres)"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Ionicons
            name={mostrarSenha ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          secureTextEntry={!mostrarConfirmarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
        >
          <Ionicons
            name={mostrarConfirmarSenha ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginVertical: 6, borderRadius: 8, flex: 1, fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 6,
  },
  eyeButton: {
    padding: 10,
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
  registerButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center"
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
