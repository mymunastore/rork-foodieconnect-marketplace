import { Review } from "@/types";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "@/constants/colors";
import { Star } from "lucide-react-native";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container} testID={`review-card-${review.id}`}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userImage ? (
            <Image source={{ uri: review.userImage }} style={styles.userImage} />
          ) : (
            <View style={styles.userImagePlaceholder} />
          )}
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.date)}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              color={Colors.rating}
              fill={i < review.rating ? Colors.rating : "transparent"}
              style={styles.star}
            />
          ))}
        </View>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  date: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    marginLeft: 2,
  },
  comment: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
});