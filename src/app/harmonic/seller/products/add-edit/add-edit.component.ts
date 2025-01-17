// add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '@shared/services/user.service';
import {
  GET_BRANDS,
  GET_CASE_MATERIAL,
  GET_CATEGORIES,
  GET_COLLECTION,
  GET_DELIVERY_OPTIONS,
  GET_DIAL_COLOR,
  GET_MOVEMENTS,
  GET_RECIPIENTS,
  GET_STRAP_MATERIAL,
  GET_WATCH_MARKERS,
  POST_PRODUCT,
  POST_PRODUCT_DESCRIPTION,
  POST_PRODUCT_DETAILS,
  POST_PRODUCT_RETURN_POLICY,
} from 'src/app/config';
import { GenericService } from 'src/app/shared/services/generic.service';
import {
  Brand,
  CaseMaterial,
  Category,
  Collection,
  DeliveryOption,
  DialColor,
  Movement,
  Recipient,
  StrapMaterial,
  WatchMarker,
} from 'src/app/shared/types/product-d-t';
import { AppState } from 'src/app/store/app.state';
import { selectUserData } from 'src/app/store/selectors/user.selectors';
import { concatMap } from 'rxjs/operators';

interface SelectOption {
  id: number;
  name: string;
}

interface UploadedImage {
  file: File;
  url: string;
}

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  // Form groups
  basicProductInformation!: FormGroup;
  productInformation!: FormGroup;
  productDescription!: FormGroup;
  deliveryAndReturns!: FormGroup;
  media!: FormGroup;

  // Component state
  isLinear = true;
  isEditing = false;
  productId?: number;
  uploadedImages: UploadedImage[] = [];
  errorMessage = '';

  // Dropdown options
  brands: Brand[] = [];
  categories: Category[] = [];
  collections: Collection[] = [];
  recipients: Recipient[] = [];
  dialColors: DialColor[] = [];
  waterResistant: any = [
    { id: 'Yes', name: 'Yes' },
    { id: 'No', name: 'No' },
    { id: 'Both', name: 'Both' },
  ];
  movements: Movement[] = [];
  strapMaterials: StrapMaterial[] = [];
  caseMaterials: CaseMaterial[] = [];
  watchMarkers: WatchMarker[] = [];
  deliveryOptions: DeliveryOption[] = [];

  // Image upload configuration
  readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  readonly maxImages = 5;
  readonly minImages = 2;
  currentIndex = 0;
  userData: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.checkForEditMode();
    this.initialApiCalls();
    this.userService.getUserData();
    this.userService.userData$.subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  private initializeForms(): void {
    this.basicProductInformation = this.fb.group({
      productName: ['', Validators.required],
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      collectionId: ['', Validators.required],
      price: ['', Validators.required],
      recipientId: ['', Validators.required],
    });

    this.productInformation = this.fb.group({
      dialColorId: ['', Validators.required],
      diameter: ['', Validators.required],
      waterResistant: [''],
      movementId: ['', Validators.required],
      strapMaterialId: ['', Validators.required],
      caseMaterialId: ['', Validators.required],
      watchMarkersId: ['', Validators.required],
      manufacturerProductNumber: [''],
      guarantee: [''],
      deliveryOptionId: [''],
    });

    this.productDescription = this.fb.group({
      shortTitle: [''],
      detailedDescription: [''],
      additionalDescription: [''],
    });

    this.deliveryAndReturns = this.fb.group({
      deliveryInfo: [''],
      returnsPolicy: [''],
    });

    this.media = this.fb.group({});
  }

  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.productId = +id;
      this.loadProductData();
    }
  }

  private initialApiCalls(): void {
    // Define a type for the target properties
    type TargetKeys =
      | 'brands'
      | 'categories'
      | 'collections'
      | 'dialColors'
      | 'movements'
      | 'strapMaterials'
      | 'caseMaterials'
      | 'watchMarkers'
      | 'deliveryOptions'
      | 'recipients';

    // Define mapping of URLs to variables
    const apiMapping: { url: string; target: TargetKeys }[] = [
      { url: GET_BRANDS, target: 'brands' },
      { url: GET_CATEGORIES, target: 'categories' },
      { url: GET_COLLECTION, target: 'collections' },
      { url: GET_DIAL_COLOR, target: 'dialColors' },
      { url: GET_MOVEMENTS, target: 'movements' },
      { url: GET_STRAP_MATERIAL, target: 'strapMaterials' },
      { url: GET_CASE_MATERIAL, target: 'caseMaterials' },
      { url: GET_WATCH_MARKERS, target: 'watchMarkers' },
      { url: GET_DELIVERY_OPTIONS, target: 'deliveryOptions' },
      { url: GET_RECIPIENTS, target: 'recipients' },
    ];

    // Iterate over the mapping to make API calls
    apiMapping.forEach(({ url, target }) => {
      this.genericService.getObservable(url).subscribe({
        next: (response) => {
          (this[target] as any) = response?.data; // If the type is fully known, this cast might not even be necessary
        },
        error: (err) => {
          console.error(`Error fetching data for ${target}:`, err);
        },
      });
    });
  }

  private async loadProductData(): Promise<void> {
    try {
      // Example of loading product data
      // const product = await this.productService.getProduct(this.productId);
      // this.patchFormValues(product);
    } catch (error) {
      console.error('Error loading product:', error);
      // Handle error appropriately
    }
  }

  private patchFormValues(product: any): void {
    this.basicProductInformation.patchValue({
      productName: product.productName,
      brandId: product.brandId,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
    });

    // Patch other form groups similarly
  }

  // Form getters for template access
  get productName() {
    return this.basicProductInformation.get('productName');
  }
  get brandId() {
    return this.basicProductInformation.get('brandId');
  }
  get categoryId() {
    return this.basicProductInformation.get('categoryId');
  }
  get collectionId() {
    return this.basicProductInformation.get('collectionId');
  }
  get price() {
    return this.basicProductInformation.get('price');
  }
  get recipientId() {
    return this.basicProductInformation.get('recipientId');
  }

  get dialColorId() {
    return this.productInformation.get('dialColorId');
  }
  get diameter() {
    return this.productInformation.get('diameter');
  }
  get movementId() {
    return this.productInformation.get('movementId');
  }
  get strapMaterialId() {
    return this.productInformation.get('strapMaterialId');
  }
  get caseMaterialId() {
    return this.productInformation.get('caseMaterialId');
  }
  get watchMarkersId() {
    return this.productInformation.get('watchMarkersId');
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    if (files.length + this.uploadedImages.length > this.maxImages) {
      this.errorMessage = `Maximum ${this.maxImages} images allowed`;
      return;
    }

    files.forEach((file) => {
      if (!this.allowedImageTypes.includes(file.type)) {
        this.errorMessage = `Invalid file type: ${file.name}. Please upload JPEG, PNG, or JPG files.`;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.uploadedImages.push({
            file,
            url: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    this.errorMessage = '';
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  isFormValid(): boolean {
    return (
      this.basicProductInformation.valid &&
      this.productInformation.valid &&
      this.productDescription.valid &&
      this.deliveryAndReturns.valid &&
      this.uploadedImages.length >= this.minImages &&
      this.uploadedImages.length <= this.maxImages
    );
  }

  public stepperNext(index: number, stepper: MatStepper) {
    let currentStepForm: any = this.basicProductInformation;
    if (index === 2) {
      currentStepForm = this.productDescription;
    }
    if (index === 3) {
      currentStepForm = this.deliveryAndReturns;
    }
    if (index === 4) {
      currentStepForm = this.media;
    }

    this.currentIndex = index;
    if (currentStepForm.invalid) {
      currentStepForm.markAllAsTouched();
      stepper.selectedIndex = index;
    }
  }

  async onSubmit(): Promise<void> {
    const userId = this.userData._id;
    if (!userId) {
      this.errorMessage = 'Please Login to Create !';
      return;
    }
    if (!this.isFormValid()) {
      this.errorMessage =
        'Please fill in all required fields and upload at least 2 images';
      return;
    }

    const formData = new FormData();

    // Combine all form values
    const productData = {
      ...this.basicProductInformation.value,
      ...this.productInformation.value,
      ...this.productDescription.value,
      ...this.deliveryAndReturns.value,
    };

    // Append form data
    // Object.entries(productData).forEach(([key, value]) => {
    //   formData.append(key, value as string);
    // });

    // Append images
    this.uploadedImages.forEach((image, index) => {
      formData.append(`images`, image.file);
    });

    const CREATE_PRODUCT_URL = POST_PRODUCT;
    const CREATE_PRODUCT_DETAILS_URL = POST_PRODUCT_DETAILS;
    const CREATE_PRODUCT_DESCRIPTION_URL = POST_PRODUCT_DESCRIPTION;
    const CREATE_PRODUCT_RETURN_POLICY_URL = POST_PRODUCT_RETURN_POLICY;

    try {
      // Example of submitting the form
      if (this.isEditing) {
        await this.genericService.postObservable(CREATE_PRODUCT_URL, formData);
      } else {
        const productPayload = {
          UserID: userId,
          ProductName: productData.productName,
          BrandID: productData.brandId,
          CollectionID: productData.collectionId,
          CategoryID: productData.categoryId,
          Price: productData.price,
          RecipientID: productData.recipientId,
        };

        this.genericService
          .postObservable(CREATE_PRODUCT_URL, productPayload) // First API call
          .pipe(
            concatMap((response) => {
              const productId = response?.data?.insertedId;

              // Prepare the payloads for the next calls
              const productDetailsPayload = {
                ProductID: productId,
                DialColorID: productData.dialColorId,
                Diameter: productData.diameter,
                WaterResistant: productData.waterResistant,
                MovementID: productData.movementId,
                StrapMaterialID: productData.strapMaterialId,
                CaseMaterialID: productData.caseMaterialId,
                WatchMarkersID: productData.watchMarkersId,
                ManufacturerProductNumber:
                  productData.manufacturerProductNumber,
                Guarantee: productData.guarantee,
                DeliveryOptionID: productData.deliveryOptionId,
              };

              const productDescriptionPayload = {
                ProductID: productId,
                Title: productData.shortTitle,
                Content: productData.detailedDescription,
                AdditionalDetails: productData.additionalDescription,
              };

              const productDeliveryReturnPayload = {
                ProductID: productId,
                DeliveryInformation: productData.deliveryInfo,
                ReturnsPolicy: productData.returnsPolicy,
              };

              const uploadImagesPayload = {};

              // Return each subsequent postObservable as an observable chain
              return this.genericService
                .postObservable(
                  CREATE_PRODUCT_DETAILS_URL,
                  productDetailsPayload
                )
                .pipe(
                  concatMap(() =>
                    this.genericService.postObservable(
                      CREATE_PRODUCT_DESCRIPTION_URL,
                      productDescriptionPayload
                    )
                  ),
                  concatMap(() =>
                    this.genericService.postObservable(
                      CREATE_PRODUCT_RETURN_POLICY_URL,
                      productDeliveryReturnPayload
                    )
                  ),
                  concatMap(() =>
                    this.genericService.postObservable(
                      CREATE_PRODUCT_RETURN_POLICY_URL,
                      productDeliveryReturnPayload
                    )
                  )
                );
            })
          )
          .subscribe({
            next: (response) => {},
            error: (err) => {
              console.error('Error creating product or related details:', err);
            },
          });
      }
      // Navigate back to products list
      // this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error submitting form:', error);
      this.errorMessage =
        'An error occurred while saving the product. Please try again.';
    }
  }
}
