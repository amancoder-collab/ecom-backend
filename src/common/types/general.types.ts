type ProductUpdateInput = {
    product_name?: string;
    product_description?: string;
    quantities?: number;
    price_without_gst?: number;
    gst?: number;
    descounted_prices?: number;
    specification?: SpecificationJsonWhileUpdate;
    stock?: number;
    size?: string[];
    colors?: string[];
    images?: string[];
};

type SpecificationJsonWhileUpdate = {
    fabric?: string;
    material?: string;
    care_instructions?: string;
    color?: string;
    pattern?: string;
    closure_type?: string;
    sleeve_length?: string;
    country_of_origin?: string;
    warranty?: string;
};

type UpdateAddressInput = {
    yourName?: string;
    houseNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    landMark?: string;
    phoneNumber?: string;
    companyName?: string;
    gstNumber?: string;
    userId?: string;
};
