enum CoffeesPermission {
    CreateCoffee = "create_coffee",
    UpdateCoffee = "update_coffee",
    DeleteCoffee = "delete_coffee",
  }

export const Permission = {
  ...CoffeesPermission,
};

export type PermissionType = CoffeesPermission;