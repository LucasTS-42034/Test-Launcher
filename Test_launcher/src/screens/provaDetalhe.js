import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; 

export default function ProvaDetalheScreen({ navigation }) {
  const [selectedProva, setSelectedProva] = useState(null);
  const [provas, setProvas] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProvas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Provas"));
        const listaProvas = [];
        
        querySnapshot.forEach((doc) => {
          listaProvas.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setProvas(listaProvas);
      } catch (error) {
        console.error("Erro ao buscar provas: ", error);
        Alert.alert("Erro", "Verifique sua conexão ou as regras do Firebase.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvas();
  }, []);

  const renderProvaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.provaItem}
      onPress={() => setSelectedProva(item)}
    >
      <View style={styles.provaContent}>
        <Text style={styles.provaNome}>{item.nome}</Text>
        <Text style={styles.provaData}>{item.data}</Text>
        <Text style={styles.provaDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#007bff" />
    </TouchableOpacity>
  );

  const renderDetail = () => (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => setSelectedProva(null)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{selectedProva.nome}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.detailContent}>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoValue}>{selectedProva.data}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Descrição:</Text>
          <Text style={styles.infoValue}>{selectedProva.descricao}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Conteúdo a estudar:</Text>
          <Text style={styles.infoValue}>{selectedProva.conteudo}</Text>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => Linking.openURL(selectedProva.linkInscricao)}
        >
          <Ionicons name="link" size={20} color="#fff" />
          <Text style={styles.linkButtonText}>Ir para inscrição</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando provas...</Text>
        </View>
      ) : selectedProva ? (
        renderDetail()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Provas Disponíveis</Text>
          </View>

          <FlatList
            data={provas}
            renderItem={renderProvaItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
               <Text style={styles.emptyText}>Nenhuma prova encontrada no banco de dados.</Text>
            }
          />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center" },
  list: { flex: 1, paddingHorizontal: 20 },
  listContainer: { paddingBottom: 20 },
  provaItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10, padding: 15, marginBottom: 10,
    flexDirection: "row", alignItems: "center",
    elevation: 5,
  },
  provaContent: { flex: 1 },
  provaNome: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  provaData: { fontSize: 14, color: "#666", marginBottom: 5 },
  provaDescricao: { fontSize: 12, color: "#888" },
  detailContainer: { flex: 1 },
  detailHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  backButton: { padding: 5 },
  detailTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  detailContent: { flex: 1, padding: 20 },
  infoSection: { marginBottom: 20 },
  infoLabel: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  infoValue: { fontSize: 14, color: "#fff", lineHeight: 20 },
  linkButton: {
    backgroundColor: "#007bff", flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 15, paddingHorizontal: 20,
    borderRadius: 10, marginTop: 20,
  },
  linkButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 16 },
  emptyText: { color: '#fff', textAlign: 'center', marginTop: 20 }
});