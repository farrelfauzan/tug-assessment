export type PackagesStackParamList = {
  PackageList: undefined;
  PackageDetail: { packageId: string };
  PackageReviews: { packageId: string; packageName: string };
  CreateReview: { packageId: string; packageName: string };
};

export type AuthStackParamList = {
  Login: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
  OrderCreate: undefined;
};

export type MainTabParamList = {
  Browse: undefined;
  Orders: undefined;
  Reviews: undefined;
  Profile: undefined;
};
