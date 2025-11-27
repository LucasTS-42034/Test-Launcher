import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ navigation }) {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");

  useEffect(() => {
    loadSettings();
    loadUserData();
  }, []);

  const loadSettings = async () => {
    try {
      const notificacoes = await AsyncStorage.getItem("notificacoesAtivadas");

      if (notificacoes !== null) {
        setNotificacoesAtivadas(JSON.parse(notificacoes));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const loadUserData = () => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "");
      setProfileImage(user.photoURL || null);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      try {
        await updateProfile(auth.currentUser, {
          photoURL: result.assets[0].uri,
        });
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
      }
    }
  };

  const updateDisplayName = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert("Erro", "Nome não pode estar vazio.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName.trim(),
      });
      setDisplayName(newDisplayName.trim());
      setModalVisible(false);
      setNewDisplayName("");
      Alert.alert("Sucesso", "Nome atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
  };

  const toggleNotificacoes = (value) => {
    setNotificacoesAtivadas(value);
    saveSetting("notificacoesAtivadas", value);
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
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
    ]);
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <View style={styles.userInfo}>
            <TouchableOpacity onPress={pickImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>
                {displayName || "Nome não definido"}
              </Text>
              <Text style={styles.userStatus}>{auth.currentUser?.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setNewDisplayName(displayName);
                setModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity style={styles.actionButton} onPress={clearAllData}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
            <Text style={styles.actionButtonTextRed}>
              Limpar todos os dados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={showAbout}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>Sobre o aplicativo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Nome</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite seu nome"
                value={newDisplayName}
                onChangeText={setNewDisplayName}
                autoCapitalize="words"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSave}
                  onPress={updateDisplayName}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButtonCancel: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  modalButtonSave: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
