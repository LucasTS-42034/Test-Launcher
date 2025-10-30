import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function SettingsScreen({ navigation }) {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notificacoes = await AsyncStorage.getItem("notificacoesAtivadas");
      const tema = await AsyncStorage.getItem("temaEscuro");

      if (notificacoes !== null) {
        setNotificacoesAtivadas(JSON.parse(notificacoes));
      }
      if (tema !== null) {
        setTemaEscuro(JSON.parse(tema));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const toggleNotificacoes = (value) => {
    setNotificacoesAtivadas(value);
    saveSetting("notificacoesAtivadas", value);
  };

  const toggleTema = (value) => {
    setTemaEscuro(value);
    saveSetting("temaEscuro", value);
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate("Login");
            } catch (error) {
              console.error("Erro ao sair:", error);
              Alert.alert("Erro", "Não foi possível sair da conta");
            }
          },
        },
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      "Limpar todos os dados",
      "Isso irá remover todas as provas salvas. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("provas");
              Alert.alert("Sucesso", "Todos os dados foram removidos");
            } catch (error) {
              console.error("Erro ao limpar dados:", error);
              Alert.alert("Erro", "Não foi possível limpar os dados");
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      "Sobre o App",
      "Test Launcher v1.0.0\n\nUm aplicativo para gerenciar suas provas e vestibulares.\n\nDesenvolvido com React Native e Expo.",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        {/* Informações do usuário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle" size={50} color="#fff" />
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>
                {user?.email || "Usuário"}
              </Text>
              <Text style={styles.userStatus}>Conta ativa</Text>
            </View>
          </View>
        </View>

        {/* Configurações do app */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#fff" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notificações</Text>
                <Text style={styles.settingDescription}>
                  Receber lembretes sobre provas
                </Text>
              </View>
            </View>
            <Switch
              value={notificacoesAtivadas}
              onValueChange={toggleNotificacoes}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificacoesAtivadas ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color="#fff" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Tema Escuro</Text>
                <Text style={styles.settingDescription}>
                  Interface com cores escuras
                </Text>
              </View>
            </View>
            <Switch
              value={temaEscuro}
              onValueChange={toggleTema}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={temaEscuro ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity style={styles.actionButton} onPress={clearAllData}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
            <Text style={styles.actionButtonTextRed}>Limpar todos os dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={showAbout}>
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Sobre o aplicativo</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  userStatus: {
    fontSize: 14,
    color: "#ddd",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  settingDescription: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 2,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 15,
  },
  actionButtonTextRed: {
    fontSize: 16,
    color: "#ff4444",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc3545",
    borderRadius: 10,
    padding: 15,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
});
