import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [provas, setProvas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeProva, setNomeProva] = useState("");
  const [dataProva, setDataProva] = useState("");
  const [descricaoProva, setDescricaoProva] = useState("");

  useEffect(() => {
    loadProvas();
  }, []);

  // Função para carregar as provas armazenadas localmente
  const loadProvas = async () => {
    try {
      const storedProvas = await AsyncStorage.getItem("provas");
      if (storedProvas) {
        setProvas(JSON.parse(storedProvas));
      }
    } catch (error) {
      console.error("Erro ao carregar provas:", error);
    }
  };

  // Função para salvar a lista de provas no armazenamento local
  const saveProvas = async (newProvas) => {
    try {
      await AsyncStorage.setItem("provas", JSON.stringify(newProvas));
    } catch (error) {
      console.error("Erro ao salvar provas:", error);
    }
  };

  // Função para adicionar uma nova prova à lista
  const addProva = () => {
    if (!nomeProva.trim() || !dataProva.trim()) {
      Alert.alert("Erro", "Nome da prova e data são obrigatórios");
      return;
    }

    const newProva = {
      id: Date.now().toString(),
      nome: nomeProva,
      data: dataProva,
      descricao: descricaoProva,
    };

    const newProvas = [...provas, newProva];
    setProvas(newProvas);
    saveProvas(newProvas);

    setNomeProva("");
    setDataProva("");
    setDescricaoProva("");
    setModalVisible(false);
  };

  // Função para excluir uma prova com confirmação do usuário
  const deleteProva = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta prova?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const newProvas = provas.filter((prova) => prova.id !== id);
            setProvas(newProvas);
            saveProvas(newProvas);
          },
        },
      ]
    );
  };

  // Função para renderizar cada item da lista de provas
  const renderProva = ({ item }) => (
    <View style={styles.provaItem}>
      <View style={styles.provaContent}>
        <Text style={styles.provaNome}>{item.nome}</Text>
        <Text style={styles.provaData}>{item.data}</Text>
        {item.descricao ? (
          <Text style={styles.provaDescricao}>{item.descricao}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => deleteProva(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Provas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={50} color="#fff" />
        </TouchableOpacity>
      </View>

      {provas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={80} color="#fff" />
          <Text style={styles.emptyText}>Nenhuma prova cadastrada ainda.</Text>
          <Text style={styles.emptySubtext}>
            Toque no botão + para adicionar uma prova.
          </Text>
        </View>
      ) : (
        <FlatList
          data={provas}
          renderItem={renderProva}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nova Prova</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da prova"
              value={nomeProva}
              onChangeText={setNomeProva}
            />

            <TextInput
              style={styles.input}
              placeholder="Data (ex: 15/12/2023)"
              value={dataProva}
              onChangeText={setDataProva}
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição (opcional)"
              value={descricaoProva}
              onChangeText={setDescricaoProva}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addProva}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {},
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
    marginTop: 10,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  provaItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  provaContent: {
    flex: 1,
  },
  provaNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  provaData: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  provaDescricao: {
    fontSize: 12,
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
