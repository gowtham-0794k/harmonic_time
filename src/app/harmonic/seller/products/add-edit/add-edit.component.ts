// add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isLinear = false;
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
  waterResistant: SelectOption[] = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
    { id: 3, name: 'Both' },
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.checkForEditMode();
    this.initialApiCalls();
  }

  private initializeForms(): void {
    this.basicProductInformation = this.fb.group({
      productName: [''],
      brandId: [''],
      categoryId: [''],
      collectionId: [''],
      price: [''],
      recipientId: [''],
    });

    this.productInformation = this.fb.group({
      dialColorId: [''],
      diameter: [''],
      waterResistant: [''],
      movementId: [''],
      strapMaterialId: [''],
      caseMaterialId: [''],
      watchMarkersId: [''],
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
    console.log('initial API calls !');
    const GET_BRANDS_URL = GET_BRANDS;
    const GET_CATEGORIES_URL = GET_CATEGORIES;
    const GET_COLLECTION_URL = GET_COLLECTION;
    const GET_DIAL_COLOR_URL = GET_DIAL_COLOR;
    const GET_MOVEMENTS_URL = GET_MOVEMENTS;
    const GET_STRAP_MATERIAL_URL = GET_STRAP_MATERIAL;
    const GET_CASE_MATERIAL_URL = GET_CASE_MATERIAL;
    const GET_WATCH_MARKERS_URL = GET_WATCH_MARKERS;
    const GET_DELIVERY_OPTIONS_URL = GET_DELIVERY_OPTIONS;
    const GET_RECIPIENTS_URL = GET_RECIPIENTS;
    this.genericService.getObservable(GET_BRANDS_URL).subscribe((response) => {
      this.brands = response?.data;
    });

    this.genericService
      .getObservable(GET_CATEGORIES_URL)
      .subscribe((response) => {
        this.categories = response?.data;
      });

    this.genericService
      .getObservable(GET_COLLECTION_URL)
      .subscribe((response) => {
        this.collections = response?.data;
      });

    this.genericService
      .getObservable(GET_DIAL_COLOR_URL)
      .subscribe((response) => {
        console.log({ response });
        this.dialColors = response?.data;
      });

    this.genericService
      .getObservable(GET_MOVEMENTS_URL)
      .subscribe((response) => {
        console.log({ response });
        this.movements = response?.data;
      });

    this.genericService
      .getObservable(GET_STRAP_MATERIAL_URL)
      .subscribe((response) => {
        console.log({ response });
        this.strapMaterials = response?.data;
      });

    this.genericService
      .getObservable(GET_CASE_MATERIAL_URL)
      .subscribe((response) => {
        console.log({ response });
        this.caseMaterials = response?.data;
      });

    this.genericService
      .getObservable(GET_WATCH_MARKERS_URL)
      .subscribe((response) => {
        console.log({ response });
        this.watchMarkers = response?.data;
      });

    this.genericService
      .getObservable(GET_DELIVERY_OPTIONS_URL)
      .subscribe((response) => {
        console.log({ response });
        this.deliveryOptions = response?.data;
      });

    this.genericService
      .getObservable(GET_RECIPIENTS_URL)
      .subscribe((response) => {
        console.log({ response });
        this.deliveryOptions = response?.data;
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
  get price() {
    return this.basicProductInformation.get('price');
  }
  get recipientId() {
    return this.productInformation.get('recipientId');
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

  async onSubmit(): Promise<void> {
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
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append images
    this.uploadedImages.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
    });

    try {
      // Example of submitting the form
      // if (this.isEditing) {
      //   await this.productService.updateProduct(this.productId!, formData);
      // } else {
      //   await this.productService.createProduct(formData);
      // }

      // Navigate back to products list
      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error submitting form:', error);
      this.errorMessage =
        'An error occurred while saving the product. Please try again.';
    }
  }
}
