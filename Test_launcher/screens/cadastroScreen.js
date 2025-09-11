import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha, nome);
      alert("Usuário cadastrado!");
      navigation.navigate("Login");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

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

     <TextInput
     style = {styles.input}
     placeholder="Confirmação de senha"
     secureTextEntry
     value={senha}
     onChangeText={setSenha}
     />

      

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Button title="Cadastrar" onPress={handleCadastro} />
      <Button
        title="Já tem conta? Faça login"
        onPress={() => navigation.navigate("Login")}
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
