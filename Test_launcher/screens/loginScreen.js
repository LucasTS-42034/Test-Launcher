import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado com sucesso!");
      // depois manda o usuário para a tela principal
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
      <Button
      title="Não tem conta? Cadastre-se"
        onPress={() => navigation.navigate("Cadastro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
  erro: { color: "red", marginBottom: 10 },
});
