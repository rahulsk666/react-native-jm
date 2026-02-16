import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-sm text-gray-200 font-normal">{label}</Text>
    <Text className="text-sm text-white font-bold mt-2">{value || "N/A"}</Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );
  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 justify-center items-center flex-1"
          />
        ) : (
          <>
            <View>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                className="w-full h-[550px]"
                resizeMode="cover"
              />
            </View>
            <View className="flex-col items-start justify-center mt-5 px-5">
              <Text className="text-xl font-bold text-white">
                {movie?.title}
              </Text>
              <View className="flex-row items-center mt-2 gap-x-1">
                <Text className="text-sm text-gray-200">
                  {movie?.release_date?.split("-")[0]}
                </Text>
                <Text className="text-sm text-gray-200">|</Text>
                <Text className="text-sm text-gray-200">
                  {movie?.runtime} min
                </Text>
              </View>
              <View className="flex-row items-center bg-slate-900 px-2 py-1 rounded-md gap-x-1 mt-2">
                <Image source={icons.star} className="size-4" />
                <Text className="text-sm font-bold text-gray-200">
                  {Math.round(movie?.vote_average || 0)}/10
                </Text>
                <Text className="text-sm text-gray-200">
                  ({movie?.vote_count} votes)
                </Text>
              </View>
              <MovieInfo label="Overview" value={movie?.overview} />
              <MovieInfo
                label="Genres"
                value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
              />
              <MovieInfo label="Status" value={movie?.status} />
              <View className="flex flex-row justify-between w-1/2">
                <MovieInfo
                  label="Budget"
                  value={
                    movie?.budget
                      ? `$${movie?.budget / 1_000_000} million`
                      : "N/A"
                  }
                />
                <MovieInfo
                  label="Revenue"
                  value={
                    movie?.revenue
                      ? `$${Math.round(movie?.revenue / 1_000_000)} million`
                      : "N/A"
                  }
                />
              </View>
              <MovieInfo
                label="Product Companies"
                value={
                  movie?.production_companies.map((m) => m.name).join(" - ") ||
                  "N/A"
                }
              />
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-darkAccent rounded-lg py-3.5 flex-row items-center justify-center z-50"
        onPress={router.dismissAll}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          resizeMode="contain"
          tintColor={"#fff"}
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
