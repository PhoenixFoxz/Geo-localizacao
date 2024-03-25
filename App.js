import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  /* State para monitorar dados da atualização atual do usuário 
  Inicialmente, nulo */
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);

  useEffect(() => {
    async function obterLocalizacao() {
      /* Acessando o status da requisição de permissão de uso dos recursos de geolocalização */
      const { status } = await Location.requestForegroundPermissionsAsync();

      /* Se o status NÃO FOR liberado/permitido, então
      será dado um alerta notificando o usuário */
      if (status !== "granted") {
        Alert.alert("Ops!", "Você não autorizou o uso de geolocalização");
        return;
      }

      /* Se o status estiver OK, obtemos os dados da localização atual. E atualizamos o state de minhaLocalizacao. */
      let localizacaoAtual = await Location.getCurrentPositionAsync({});

      setMinhaLocalizacao(localizacaoAtual);
    }

    obterLocalizacao();
  }, []);

  console.log(minhaLocalizacao);

  /* Este state tem a finalidade de determinar a posição/localização no MapView junto com o Marker. Inicialmente é nulo pois o usuário ainda não acionou o botão da sua localização. */
  const [localizacao, setLocalizacao] = useState(null);

  const regiaoInicialMapa = {
    /*
    // Brasil 
    latitude: -10,
    longitude: -55, */
    // São Paulo
    latitude: -23.533773,
    longitude: -46.65529,
    /* Definição do zoom do mapa.
    Quanto menor, mais próximo o mapa.
    Quanto maior, mais longe o mapa fica. */
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  const marcarLocal = () => {
    setLocalizacao({
      // Obtendo novos valores a partir da geolocalização da posição do usuário
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.viewBotao}>
          <Button title="Onde estou?" onPress={marcarLocal} />
        </View>
        <View style={styles.viewMapa}>
          <MapView
            mapType="hybrid"
            style={styles.mapa}
            region={localizacao ?? regiaoInicialMapa}
          >
            {localizacao && (
              <Marker coordinate={localizacao} draggable>
                {/* Ícone personalizado */}
                <Image source={require("./assets/ghost.png")} />
              </Marker>
            )}
          </MapView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapa: { width: "100%", height: "100%" },
});
