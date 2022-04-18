import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import CoinItem from "../../components/CoinItem";
import { useWatchlist } from "../../Contexts/WatchlistContext";
import { getMarketData } from "../../services/requests";

const HomeScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const { watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } =
    useWatchlist();

  const checkIfCoinIsWatchlisted = (coinId) =>
    watchlistCoinIds?.some((coinIdValue) => coinIdValue === coinId);

  const handleWatchlistCoin = (coinId) => {
    if (checkIfCoinIsWatchlisted(coinId)) {
      return removeWatchlistCoinId(coinId);
    }
    return storeWatchlistCoinId(coinId);
  };

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    setLoading(false);
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const renderItem = ({ item }) => {
    const isWatched = checkIfCoinIsWatchlisted(item?.id);
    return (
      <CoinItem
        marketCoin={item}
        isWatched={isWatched}
        onPress={handleWatchlistCoin}
      />
    );
  };

  const getKey = (item, index) => {
    const { id } = item || {};
    return id + index;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "DroidSans",
            color: "white",
            fontSize: 25,
            letterSpacing: 1,
            paddingHorizontal: 20,
            paddingBottom: 5,
          }}
        >
          Crypto Currency
        </Text>
        <Text
          style={{ color: "lightgrey", fontSize: 12, paddingHorizontal: 10 }}
        >
          Powered by Rean.vo
        </Text>
      </View>
      <FlatList
        data={coins}
        renderItem={renderItem}
        onEndReached={() => fetchCoins(coins.length / 50 + 1)}
        keyExtractor={getKey}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={refetchCoins}
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
