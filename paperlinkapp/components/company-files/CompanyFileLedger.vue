<template>
  <div>
    <!-- Start:: header -->
    <h5
      class="text-lg ml-5 inline-flex font-semibold text-[#272727] xl:hidden my-2 flex-wrap items-center"
    >
      <span v-if="!$_teamId" class="mr-5 font-normal text-[0.6rem] flex items-center w-full">
        <input type="checkbox" v-model="allowCopy" class="mr-3 transform scale-125" />
        Click here to allow guest to request copy
      </span>
    </h5>
    <header class="flex justify-between items-end mt-4">
      <!-- tab -->
      <div class="h-full ml-2 flex">
        <div
          @click="changeTab(1)"
          :class="[tabNumber === 1 ? 'active-tab' : 'tab']"
          class="mr-4"
        >
          <p class="inline-flex justify-between w-full mr-1">Files <abbr class="px-1">{{ allUserPages || "0" }}</abbr></p>
        </div>
        <div
          :class="[tabNumber === 2 ? 'active-tab' : 'tab']"
          @click="changeTab(2)"
          class="tab"
        >
          <p class="inline-flex justify-between w-full mr-1">Folders <abbr class="px-1">{{ forlderDetails ? forlderDetails.totalPages : ""}}</abbr></p>
        </div>
      </div>

      <div
        class="flex h-[40px] w-full flex-col xs:flex-row items-center justify-center lg:justify-end  px-2"
      >
        <h5
          class="text-lg hidden font-semibold text-[#272727] xl:inline-flex w-10/12 ml-[20px] gap-2 my-2 flex-wrap items-center"
        >
          <span v-if="!$_teamId" class="mr-5 font-normal text-[0.8rem] flex items-center w-full">
            <input type="checkbox" v-model="allowCopy" class="mr-3 transform scale-125" />
            Click here to allow guest to request copy
          </span>
        </h5>

       

        <div class="w-full transition-all mb-4 justify-end text-white flex items-center my-2">
          <div class="w-auto transition-all hidden sm:flex items-center mr-3 rounded-[20px] bg-white">
            <input
            v-show="tabNumber === 1 || folderSelected === true "
              type="text"
              :class="[showSearch ? 'w-2/3 ' : '!w-0 hidden']"
              class="h-8 ml-2 sm:h-10 text-[0.9rem] transition-all bg-transparent ps-2 flex-1 border-[1px] border-transparent rounded-lg focus:border-transparent text-black outline-none"
              placeholder="Search Files"
              v-model="fileSearch"
            />
            <input
            v-show="tabNumber === 2 && folderSelected === false "
              type="text"
              :class="[showSearch ? 'w-2/3 ' : '!w-0 hidden']"
              class="h-8 ml-2 sm:h-10 text-[0.9rem]  transition bg-transparent ps-2 flex-1 border-[1px] border-transparent rounded-lg focus:border-transparent text-black outline-none"
              placeholder="Search Folders"
              v-model="folderSearch"
            />
            <button
              @click="handleShowSearch"
              class="circle circle-16 sm:circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
            >
              <search-icon width="16" height="16" currentcolor="white" />
            </button>
          </div>
          <el-dropdown trigger="click">
            <button
              class="circle circle-18 p-0 text-[2rem] bg-paperdazgreen-400 text-xl hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
            >
              +
            </button>
            <el-dropdown-menu slot="dropdown" class="table-menu-dropdown-menu">
              <ul class="min-w-[150px]">
                <li class="dropdown-item" @click="showUploadModalFunction">
                  <span>Upload File</span>
                </li>
                <li class="dropdown-item" @click="showCreateCompanyFolderFunc">
                  <span>Create Folder</span>
                </li>
              </ul>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- End:: header -->
    <transition name="fade" mode="out-in" :duration="100">
      <!-- <empty-file-ledger class="min-h-[55vh]" v-if="pdfUser < 1" :isPaidUser= "isPaidUser"/> -->
      <div
        class="bg-white border-t-[5px] border-t-[#77C360] rounded h-full sm:rounded-3xl pb-4 text-[#272727] overflow-hidden"
      >
        <div
          class="flex sm:hidden items-center justify-between px-4 py-3 border-b border-gray-100"
        >
          <div v-if="folderSelected" class="font-medium flex items-center">
            <div class="" @click="backFolder">
              <arrow-down-icon class="h-2 w-3 rotate-90" />
            </div>
            <h2 class="font-bold pl-4">{{ FilesInFolerContent.name }}</h2>
          </div>
         
        </div>
        <!-- Start:: Folders -->
        <div v-if="!folderSelected" class="">
          <div>
            <div
              v-show="isFolderTabSelected"
              class="overflow-x-auto custom-scrollbar relative"
            >
              <!-- START: spinner container -->
              <div
                v-if="folderSpinner"
                class="absolute z-10 w-full h-full bg-transparent top-0 left-0 rounded-lg flex justify-center items-center"
              >
                <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
              </div>
              <section class="px-0 w-full">
                <div class="border-b-[1px] border-gray-200 flex items-center py-3">
                  <p
                    class="sm:w-1/12 w-2/12 inline-block text-[0.6rem] lg:text-[0.9rem] font-bold text-center"
                  >
                    Order
                  </p>
                  <p
                    class="text-left text-[0.6rem] lg:text-[0.9rem] inline-block font-bold w-4/12 sm:w-3/12"
                  >
                    Folder Name
                  </p>
                  <p
                    class="text-center text-[0.6rem] lg:text-[0.9rem] inline-block font-bold w-3/12 sm:w-1/12"
                  >
                    Files
                  </p>
                  <p
                    class="text-center text-[0.7rem] lg:text-[0.9rem] hidden sm:inline-block w-2/12"
                  ></p>
                  <p
                    class="text-center font-bold text-[0.7rem] lg:text-[0.9rem] hidden sm:inline-block w-2/12"
                  >
                    Privacy
                  </p>
                  <p
                    class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
                  ></p>
                  <p
                    class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold inline-block w-3/12 sm:w-1/12"
                  >
                  <div
                    :class="[
                      showSearch
                        ? 'absolute w-[100%]  top-[10px] left-0 flex justify-center     '
                        : 'reletave w-auto',
                    ]"
                    class="mr-4"
                  >
                    <div
                      :class="[showSearch ? 'w-[95%]' : ' w-auto']"
                      class="flex sm:hidden items-center bg-[#F3F3F3] rounded-[20px]"
                    >
                      <input
                        type="text"
                        :class="[showSearch ? 'flex-1 ' : '!w-0 hidden']"
                        class="h-8 ml-2 sm:h-10 transition bg-transparent ps-2 flex-1 border-[1px] border-transparent rounded-lg focus:border-transparent text-black outline-none"
                        placeholder="Search file"
                        v-model="folderSearch"
                      />
                      <button
                        @click="showSearch = !showSearch"
                        class="circle circle-16 sm:circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 scale-110 transition duration-0 hover:duration-150"
                      >
                        <search-icon width="16" height="16" currentcolor="white" />
                      </button>
                    </div>
                  </div>
                  </p>
                </div>
                <draggable
                  v-if="!folderSelected"
                  v-model="folders"
                  group="paperlink"
                  @change="onChangeFolder"
                  class="px-0"
                  handle=".handle"
                  @start="drag=true" @end="drag=false"
                >
                  <div
                    v-for="(folder, i) in folders"
                    :key="folder.id"
                    class="py-2 border-b-[1px] bg-white border-gray-200 list-none px-0 flex items-center w-full"
                  >
                    <div class="sm:w-1/12 w-2/12 inline-flex justify-center">
                      <!-- <i class="fa fa-align-justify "></i> -->

                      <button  :class="[drag ? '!cursor-grabbing' : '!cursor-grab']" class="handle cursor-grab">
                      <img class="W-[20px]" src="~/assets/icons/grid_item.svg" alt="">
                      </button>
                    </div>
                    <div class="text-left inline-block w-4/12 sm:w-3/12 truncate">
                      <div class="flex items-center  sm:gap-3 sm:min-w-[150px] truncate">
                        <img class="w-[15px] mr-2 md:w-[28px]" src="~/assets/img/Vector.png" />
                        <div class="truncate">
                          <p
                            class="truncate underline !text-[0.8rem] sm;!text-[0.8rem] md;text-base font-normal text-left sm:ml-1"
                          >
                            <span
                              class="cursor-pointer"
                              @click="showFolderFilesFunc(folder)"
                            >
                              {{ folder.name }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="text-center w-3/12 sm:w-1/12 text-[0.8rem] px-1 inline-block md:text-xs"
                    >
                      {{ folder.files.length }}
                    </div>
                    <div
                      class="text-sm text-center capitalize hidden sm:inline-block w-2/12"
                    ></div>
                    <div
                      class="text-sm text-center capitalize hidden sm:inline-block w-2/12 cursor-pointer"
                    >
                      <button @click="switchFolderVisibility(folder)">
                        <img
                          v-show="folder.isPrivate"
                          src="~/assets/icons/eye-hide.svg"
                          alt=""
                        />
                        <img
                          v-show="!folder.isPrivate"
                          else
                          src="~/assets/icons/eye_see.svg"
                          alt=""
                        />
                      </button>
                    </div>
                    <div
                      class="text-center px-1 hidden sm:inline-block w-2/12 text-xs"
                    ></div>
                    <div
                      class="w-3/12 sm:w-1/12 flex items-center text-center justify-center"
                    >
                      <button
                        class="sm:hidden pr-6 w-full h-full flex justify-end items-center cursor-pointer rounded-full"
                        @click="actionFolder = folder"
                      >
                        <ellipsis-icon-vertical-icon />
                      </button>
                      <el-dropdown trigger="click">
                        <button
                          class="el-dropdown-link hidden w-8 h-8 cursor-pointer sm:grid place-items-center rounded-full"
                          :class="[
                            createdByTeamMember(folder.createdBy) && isTeam
                              ? 'bg-paperdazgreen-300/20'
                              : '',
                          ]"
                        >
                          <ellipsis-icon-vertical-icon />
                        </button>

                        <!-- <button
                          class="hidden el-dropdown-link w-8 h-8 cursor-pointer sm:grid place-items-center rounded-full"
                        >
                          <ellipsis-icon-vertical-icon />
                        </button> -->
                        <el-dropdown-menu
                          slot="dropdown"
                          class="table-menu-dropdown-menu"
                        >
                          <div
                            class="no-access"
                            v-if="!createdByTeamMember(folder.createdBy)"
                          >
                            no access right
                          </div>
                          <ul v-else class="min-w-[150px]">
                            <li
                              class="dropdown-item"
                              @click="showEditCompanyFolderFunc(folder)"
                            >
                              <div
                                class="flex justify-between w-full border-t border-gray-200"
                              >
                                <PenIcon
                                  width="16"
                                  height="16"
                                  class="inline-block float-left"
                                />
                                <span class="ml-1">Edit</span>
                              </div>
                            </li>
                            <li
                              class="dropdown-item"
                              @click="showDeleteCompanyFolderFunc(folder)"
                            >
                              <div
                                class="flex justify-between w-full border-t border-gray-200"
                              >
                                <trash-can-icon
                                  width="16"
                                  height="16"
                                  class="inline-block float-left"
                                />
                                <span>Remove</span>
                              </div>
                            </li>
                          </ul>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </draggable>
              </section>

              <!-- <FilePagination :totalFile="totalFile" @setPage="setPage" /> -->
            </div>
            <!-- <FilePagination v-if="!folderSelected" :totalFile="totalFile" @setPage="setPage" /> -->
          </div>
        </div>

       
        <div class="relative">
            <img
              v-show="!fileSpinner && folders?.length === 0 && isFolderTabSelected"
              src="../../assets/img/dashboard-bg.png"
              class="position-absolute mt-24 w-[150px] left-[50%] translate-x-[-50%] md:w-auto sm:w-[200px]"
            />
            <table
              v-show="!fileSpinner && folders?.length === 0 && isFolderTabSelected"
              key="3"
              ref="fileLedgerTable"
              class="custom-table px-2 py-2 rounded-md"
            >
             
              <tbody>
                <tr v-for="i in 10" :key="i">
                  <td class="text-left fixed-col left">{{ i }}</td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="fixed-col right"></td>
                </tr>
              </tbody>
            </table>
          </div>

        <!-- Mobile Folder -->
       
        <!-- End:: Folders -->
        <!-- FOlders files -->
        <!-- Start:: Files -->
        <div v-show="tabNumber === 1">
          <div class="overflow-x-auto custom-scrollbar relative">
            <!-- START: spinner container -->
          
            <div
              v-if="fileSpinner"
              class="absolute z-10 w-full h-full bg-transparent top-0 left-0 rounded-lg flex justify-center items-center"
            >
              <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
            </div>

            <section class="px-0 w-full">
              <div class="border-b-[1px] border-gray-200 relative flex items-center py-3">
                <p
                  class="sm:w-1/12 w-2/12 inline-block text-[0.7rem] lg:text-[0.9rem] font-bold text-center"
                >
                  Order
                </p>
                <p
                  class="text-left text-[0.7rem] lg:text-[0.9rem] inline-block font-bold w-4/12 sm:w-3/12"
                >
                  File Name
                </p>
                <p
                  class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold inline-block w-3/12 sm:w-1/12"
                >
                  Pages <span class="pages">{{ allUserPages || "0" }}</span>
                </p>
                <p
                  class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
                >
                  Action Required
                </p>
                <p
                  class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
                >
                  Privacy
                </p>
                <p
                  class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
                >
                  Date &amp; Time
                </p>
                <p class="text-center font-bold inline-block w-3/12 sm:w-1/12">
                  <div
                    :class="[
                      showSearch
                        ? 'absolute w-[100%]  top-[10px] left-0 flex justify-center     '
                        : 'reletave w-auto',
                    ]"
                    class="mr-4"
                  >
                    <div
                      :class="[showSearch ? 'w-[95%]' : ' w-auto']"
                      class="flex sm:hidden items-center bg-[#F3F3F3] rounded-[20px]"
                    >
                      <input
                        type="text"
                        :class="[showSearch ? 'flex-1 ' : '!w-0 hidden']"
                        class="h-8 ml-2 sm:h-10 transition bg-transparent ps-2 flex-1 border-[1px] border-transparent rounded-lg focus:border-transparent text-black outline-none"
                        placeholder="Search file"
                        v-model="fileSearch"
                      />
                      <button
                        @click="showSearch = !showSearch"
                        class="circle circle-16 sm:circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 scale-110 transition duration-0 hover:duration-150"
                      >
                        <search-icon width="16" height="16" currentcolor="white" />
                      </button>
                    </div>
                  </div>
                </p>
              </div>
              <draggable
                v-if="!folderSelected"
                v-model="files"
                group="paperlink"
                @change="onChange"
                class="px-0"
                handle=".handle"
                @start="drag=true" @end="drag=false"

              >
                <div
                  v-for="(file, i) in files"
                  :key="file.id"
                  class="py-2 border-b-[1px] bg-white border-gray-200 list-none px-0 flex items-center w-full"
                >
                  <div class="sm:w-1/12 w-2/12 inline-flex justify-center">
                    <button
                      :class="[drag ? '!cursor-grabbing' : '!cursor-grab']"
                      class="handle "><DragIcon /></button>
                  </div>
                  <div class="text-left inline-block w-4/12 sm:w-3/12 truncate">
                    <div class="flex items-center gap-3 sm:min-w-[150px] truncate">
                      <div class="truncate">
                        <p
                          class="truncate transition-all underline !text-[0.8rem] md;text-base font-normal text-left sm:ml-1 hover:text-paperdazgreen-700 hover:scale-95"
                        >
                          <span
                            class="cursor-pointer"
                            @click="routeToFileManager(`/pdf/${file.paperLink}`)"
                          >
                            {{ file.fileName | removeExtension }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-center w-3/12 sm:w-1/12 text-[0.8rem] px-1 inline-block md:text-xs"
                  >
                    {{ file.pages }}
                  </div>
                  <div
                    class="text-sm text-center capitalize hidden sm:inline-block w-2/12"
                    :class="
                      file.fileAction === FileAction.COMPLETE
                        ? 'text-paperdazgreen-400'
                        : file.fileAction === FileAction.SIGNED
                        ? 'text-blue-400'
                        : file.fileAction === FileAction.CONFIRM
                        ? 'text-purple-400'
                        : ''
                    "
                  >
                    {{
                      file.fileAction && file.fileAction !== FileAction.SHARED
                        ? file.fileAction
                        : ""
                    }}
                  </div>
                  <div
                  class="text-sm text-center   capitalize hidden sm:inline-block w-2/12"
                    @click="
                      file.filePrivacy == 'private' && $emit('showPermission', true, file.id, file)
                    "
                    :class="file.filePrivacy === 'private' ? 'transition-all hover:scale-95  underline cursor-pointer text-paperdazgreen-700' : ''"
                  >
                    {{ (file || {}).filePrivacy }}
                  </div>
                  <div class="text-center px-1 hidden sm:inline-block w-2/12 text-xs">
                    {{ formatDateTime(file.updatedAt) }}
                  </div>
                  <div class="fixed-col right w-3/12 sm:w-1/12 text-center inline-block">
                    <div class="w-full flex justify-end  md:justify-center">
                      <button
                        class="sm:hidden w-8 h-8 cursor-pointer rounded-full"
                        :class="[
                          createdByTeamMember(file.uploadedBy) && isTeam
                            ? 'bg-paperdazgreen-300/20'
                            : '',
                        ]"
                        @click="actionFile = file"
                      >
                        <ellipsis-icon-vertical-icon />
                      </button>
                      <el-dropdown trigger="click">
                        <button
                          class="hidden el-dropdown-link w-8 h-8 cursor-pointer sm:grid place-items-center rounded-full"
                          :class="[
                            createdByTeamMember(file.uploadedBy) && isTeam
                              ? 'bg-paperdazgreen-300/20'
                              : '',
                          ]"
                        >
                          <ellipsis-icon-vertical-icon />
                        </button>
                        <el-dropdown-menu
                          slot="dropdown"
                          class="table-menu-dropdown-menu hidden sm:block"
                        >
                          <ul class="min-w-[150px]">
                            <li
                              class="dropdown-item"
                              @click="showEditCompanyFileFunc(file)"
                            >
                              <div
                                class="flex justify-between items-center w-full border-t border-gray-200"
                              >
                                <div class="h-full inline-block w-[20px] float-left">
                                  <PenIcon width="16" height="16" />
                                </div>

                                <p class="grid place-content-center">Edit</p>
                              </div>
                            </li>

                            <li
                              class="dropdown-item"
                              @click="showShareCompanyFileFunc(file)"
                              divided
                            >
                              <div
                                class="flex justify-between items-center w-full border-t border-gray-200"
                              >
                                <div class="h-full inline-block w-[20px] float-left">
                                  <share-icon width="16" height="16" />
                                </div>

                                <p class="grid place-content-center">Share</p>
                              </div>
                            </li>

                            <li
                              class="dropdown-item"
                              @click="showMoveCompanyFileFunc(file)"
                              divided
                            >
                              <div
                                class="flex justify-between items-center w-full border-t border-gray-200"
                              >
                                <div class="h-full inline-block w-[20px] float-left">
                                  <MoveIcon width="16" height="16" />
                                </div>

                                <p class="grid place-content-center">Move</p>
                              </div>
                            </li>

                            <li
                              class="dropdown-item"
                              @click="showRemoveCompanyFileFunc(file)"
                            >
                              <div
                                class="flex justify-between items-center w-full border-t border-gray-200"
                              >
                                <div class="h-full inline-block w-[20px] float-left">
                                  <trash-can-icon width="16" height="16" class="" />
                                </div>

                                <p class="grid place-content-center">Remove</p>
                              </div>
                            </li>
                          </ul>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </draggable>
           
            </section>

          <div class="relative">
            <img
              v-show="!fileSpinner && files?.length === 0"
              src="../../assets/img/dashboard-bg.png"
              class="position-absolute mt-24 w-[150px] left-[50%] translate-x-[-50%] md:w-auto sm:w-[200px]"
            />
            <table
              v-show="!fileSpinner && files?.length === 0"
              key="3"
              ref="fileLedgerTable"
              class="custom-table px-2 py-2 rounded-md"
            >
             
              <tbody>
                <tr v-for="i in 10" :key="i">
                  <td class="text-left fixed-col left">{{ i }}</td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="fixed-col right"></td>
                </tr>
              </tbody>
            </table>
          </div>


          </div>
          <!-- <FilePagination v-if="!folderSelected" :totalFile="totalFile" @setPage="setPage" /> -->
        </div>

        <!-- End:: Files -->
        <!-- Start:: Files -->
        <div v-show="tabNumber === 2 && folderSelected">
          <div
            v-if="folderSelected"
            class="text-xl text-paperdazgreen-400 font-medium px-5 border-b border-gray-100 h-16 hidden sm:flex items-center"
          >
            <button
              class="bg-paperdazgreen-400 p-2 py-1 text-white text-lg rounded-lg"
              @click="backFolder"
            >
              Back
            </button>
            <h2 class="text-paperdazgreen-400 font-bold w-5/6 text-center">
              {{ FilesInFolerContent.name }}
            </h2>
          </div>
          <div class="overflow-x-auto custom-scrollbar relative">
            <!-- START: spinner container -->
            <div
              v-if="fileSpinner"
              class="absolute z-10 w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
            >
              <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
            </div>
            <!-- END: spinner container -->
            <!-- <empty-file-ledger class="min-h-[55vh]" v-if="(pdfUser.length < 1) && !fileSpinner" :isPaidUser="isPaidUser" /> -->
            <!--START: No files container-->
            <section class="px-0 w-full">
              <FileInFolder_
                v-if="folderSelected"
                :refresh="refresh"
                :showMoveCompanyFileFunc="showMoveCompanyFileFunc"
                :showShareCompanyFileFunc="showShareCompanyFileFunc"
                :showEditCompanyFileFunc="showEditCompanyFileFunc"
                :showRemoveCompanyFileFunc="showRemoveCompanyFileFunc"
                :emitPrivateModal="emitPrivateModal"
                :FilesInFolerContent="FilesInFolerContent"
                :actionFileInFolder="actionFileInFolder"
                :search="fileSearch"
              />
            </section>

            <!-- <FilePagination :totalFile="totalFile" @setPage="setPage" /> -->
          </div>
          <!-- <FilePagination v-if="!folderSelected" :totalFile="totalFile" @setPage="setPage" /> -->
        </div>
        <!-- End:: Files -->
      </div>
    </transition>
    <upload-document-modal
      @resetUserFolder="resetUserFolder"
      :folder="fileProps"
      v-model="showUploadDocumentModal"
    />
    <CreateCompanyFolder
      @refresh="setRefresh"
      :userFile="userFile"
      @resetUserFile="resetUserFile"
      v-model="showCreateCompanyFolder"
    />
    <EditCompanyFolder
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showEditCompanyFolder"
    />
    <EditCompanyFile
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showEditCompanyFile"
    />
    <QrCode @refresh="setRefresh" :file="fileProps" v-model="showQrCode" />
    <DeleteCompanyFolder
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showDeleteCompanyFolder"
    />
    <CreateTeam
      @refresh="setRefresh"
      @showMaxInviteTeam="showMaxInviteTeam"
      v-model="showCreateTeam"
    />
    <DeleteCompanyFolder
      @refresh="setRefresh"
      :file="fileProps"
      v-model="showDeleteCompanyFolder"
    />
    <RemoveCompanyFile
      @refresh="setRefresh"
      :userFile="userFile"
      v-model="showRemoveCompanyFiles"
    />
    <PdfPapertagsModal
      @refresh="setRefresh"
      :file="userFile"
      v-model="showPapertagsModal"
    />
    <MoveCompanyFiles
      @refresh="setRefresh"
      :userFile="userFile"
      @resetUserFile="resetUserFile"
      @createFolderEmit="showCreateCompanyFolderFunc"
      v-model="showMoveCompanyFiles"
      :folderProps="this.folders"
    />
    <ShareFilesModal
      @refresh="setRefresh"
      :userFile="userFile"
      :type="type"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
      :link="link"
    />
    <RequestModal
      @refresh="setRefresh"
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showRequestModal"
    />
    <AddCompanyfiles
      @refresh="setRefresh"
      :file="fileProps"
      :totalFile="totalFile"
      @createFile="showUploadDocumentModal = true"
      v-model="showAddCompanyFiles"
    />
    <FilesFolder :folder="FilesInFolerContent" v-model="showFilesInFolder" />
    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
    <MaxPaperlinkModal v-model="showMaxPaperlinkModal" :totalFile="totalRegisteredPaperlink" />
    <PdfCCFlowModal :file="userFile" v-model="showCCFlowModal" />
    <MaxInviteModal v-model="maxInviteTeam" />

    <!-- File Bottom Dialog -->
    <el-dialog
      :visible.sync="actionFile"
      :append-to-body="true"
      :show-close="false"
      width="100%"
      top="77vh"
      custom-class="-translate-y-full  sm:hidden bottom-sm-modal"
      class="bottom-0 overflow-hidden pb-8 sm:hidden"
    >
      <div class="w-full flex flex-col p-0 -mt-8 -mb-4" v-if="actionFile">
        <div class="flex justify-center flex-col items-center">
          <p class="mb-2">{{ actionFile.user.company_name }}</p>
          <p>{{ actionFile.fileName | removeExtension }}</p>
          <div class="flex items-center justify-center my-3 w-full">
            <p class="mr-2">{{ `${actionFile?.fileAction}ed`.replace("ee", "e") }}</p>
            <button>
              <img
                v-show="actionFile.filePrivacy === 'private'"
                src="~/assets/icons/eye-hide.svg"
                alt=""
              />
              <img
                v-show="actionFile.filePrivacy === 'public'"
                src="~/assets/icons/eye_see.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <div class="no-access" v-if="!createdByTeamMember(actionFile.uploadedBy)">
          no access right
        </div>
        <ul class="min-w-[150px]" v-else>
          <li class="dropdown-item" @click="showShareCompanyFileFunc(actionFile)" divided>
            <div class="flex justify-between items-center w-full py-2">
              <div class="flex items-center">
                <div class="w-6 flex items-center justify-start">
                  <share-icon width="16" height="16" class="inline-block float-left" />
                </div>
                <span>Share</span>
              </div>
              <arrow-down-icon class="h-2 w-3 -rotate-90" />
            </div>
          </li>

          <li class="dropdown-item" @click="showEditCompanyFileFunc(actionFile)">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2"
            >
              <div class="flex items-center">
                <div class="w-6 flex items-center justify-start">
                  <PenIcon width="16" height="16" class="inline-block float-left" />
                </div>
                <span class="ml-1">Edit</span>
              </div>
              <arrow-down-icon class="h-2 w-3 -rotate-90" />
            </div>
          </li>
          <li class="dropdown-item" @click="showMoveCompanyFileFunc(actionFile)">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2"
            >
              <div class="flex items-center">
                <div class="w-6 flex items-center justify-start">
                  <MoveIcon width="16" height="16" class="inline-block float-left" />
                </div>
                <span class="ml-1">Move</span>
              </div>
              <arrow-down-icon class="h-2 w-3 -rotate-90" />
            </div>
          </li>
          <li class="dropdown-item" @click="showRemoveCompanyFileFunc(actionFile)">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Remove</span>
              <img src="~/assets/icons/Delete.svg" alt="" />
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!-- Folder Bottom Dialog -->
    <el-dialog
      :visible.sync="actionFolder"
      :append-to-body="true"
      :show-close="false"
      center
      width="100%"
      top="100vh"
      custom-class="-translate-y-full sm:hidden bottom-sm-modal"
      class="bottom-0 overflow-hidden sm:hidden"
    >
      <div class="w-full flex flex-col p-0 -mt-8 -mb-4" v-if="actionFolder">
        <!-- <div class="no-access" v-if="!createdByTeamMember(actionFolder.createdBy)">
          no access right
        </div> -->
        <div class="flex justify-center flex-col items-center">
          <p>{{ actionFolder.name }}</p>
          <div class="flex items-center justify-center my-3 w-full">
            <button @click="switchFolderVisibility(actionFolder)">
              <img
                v-show="actionFolder.isPrivate"
                src="~/assets/icons/eye-hide.svg"
                alt=""
              />
              <img
                v-show="!actionFolder.isPrivate"
                else
                src="~/assets/icons/eye_see.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <ul>
          <li class="dropdown-item" @click="showEditCompanyFolderFunc(actionFolder)">
            <div class="flex justify-between items-center w-full py-2 text-center">
              <span>Edit</span>
              <img src="~/assets/icons/Edit_i.svg" alt="" />
            </div>
          </li>
          <li class="dropdown-item" @click="showDeleteCompanyFolderFunc(actionFolder)">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            > 
              <span>Remove</span>
              <img src="~/assets/icons/Delete.svg" alt="" />
            </div>
          </li>
          <!-- <li class="dropdown-item" @click="showAddCompanyFolderFunc(actionFolder)">
            <div
              class="flex justify-center items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Add Files</span>
            </div>
          </li> -->
        </ul>
      </div>
    </el-dialog>

    <div
    v-show="this.totalFile > 10 && fileLimit <= 10 && tabNumber === 1"
    class="flex justify-center items-center flex-wrap  w-full"
  >
    <FilePagination :totalFile="totalFile" @setPage="setPage" />
    <button
      @click="seeAll()"
      class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
    >
      See all
    </button>
  </div>

  <div
    v-show="this.totalFolder > 10 && folderLimit <= 10 && tabNumber === 2"
    class="flex justify-center items-center flex-wrap  w-full"
  >
    <FilePagination :totalFile="totalFolder" @setPage="setFolderPage" />
    <button
      @click="seeAllFolder()"
      class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
    >
      See all
    </button>
  </div>
  </div>
</template>
<script>
import Vue from "vue";
import draggable from "vuedraggable";
import FileInFolder_ from "./FilesInFolder_.vue";
import UploadDocumentModal from "../dashboard/UploadDocumentModal.vue";
import CompanyIcon from "../svg-icons/CompanyIcon.vue";
import EllipsisIconVerticalIcon from "../svg-icons/EllipsisIconVerticalIcon.vue";
import HeartOutlineIcon from "../svg-icons/HeartOutlineIcon.vue";
import SearchIcon from "../svg-icons/SearchIcon.vue";
import QrcodeIcon from "../svg-icons/QrcodeIcon.vue";
import PenIcon from "../svg-icons/PenIcon.vue";
import ShareOutlineIcon from "../svg-icons/ShareOutlineIcon.vue";
import ExportIcon from "../svg-icons/ExportIcon.vue";
import MoveIcon from "../svg-icons/MoveIcon.vue";
import ShareIcon from "../svg-icons/ShareIcon.vue";
import FileSolidIcon from "../svg-icons/FileSolidIcon.vue";
import RequestIcon from "../svg-icons/RequestIcon.vue";
import CopyIcon from "../svg-icons/CopyIcon.vue";
import TrashCanIcon from "../svg-icons/TrashCanIcon.vue";
import PdfPapertagsModal from "../pdf/modals/PdfPapertagsModal.vue";
import PdfCCFlowModal from "../pdf/modals/PdfCCFlowModal.vue";
import EmptyFileLedger from "../widgets/EmptyFileLedger.vue";
import FloatingActionButton from "../widgets/FloatingActionButton.vue";
import CreateCompanyFolder from "./Tabs/CreateCompanyFolder.vue";
import CreateTeam from "./Tabs/CreateTeam.vue";
import EditCompanyFolder from "./Tabs/EditCompanyFolder.vue";
import EditCompanyFile from "./Tabs/EditCompanyFile.vue";
import QrCode from "./Tabs/QrCode.vue";
import DeleteCompanyFolder from "./Tabs/DeleteCompanyFolder.vue";
import AddCompanyfiles from "./Tabs/AddCompanyfiles.vue";
import RemoveCompanyFile from "./Tabs/RemoveCompanyFile.vue";
import MoveCompanyFiles from "./Tabs/MoveCompanyFiles.vue";
import ShareFilesModal from "./ShareCompanyLinkModal.vue";
import FolderPlusIcon from "../svg-icons/FolderPlusIcon.vue";
import PlusIcon from "../svg-icons/PlusIcon.vue";
import { mapState } from "vuex";
import DateFormatter from "~/utils/DateFormatter";
import SpinnerDottedIcon from "../svg-icons/SpinnerDottedIcon.vue";
import QrcodeShare from "./Tabs/QrcodeShare.vue";
import FilePagination from "../pagination/FilePagination.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import RequestModal from "./Tabs/RequestModal.vue";
import TeamAccess from "~/models/TeamAccess";
import FilesFolder from "./Tabs/FilesFolder.vue";
import MaxPaperlinkModal from "./Tabs/MaxPaperlinkModal.vue";
import FileAction from "~/models/FileAction";
import ArrowDownIcon from "../svg-icons/ArrowDownIcon.vue";
import EyeIcon from "../svg-icons/EyeIcon.vue";
import MaxInviteModal from "../teams/MaxInviteModal.vue";
import DragIcon from "../svg-icons/DragIcon.vue";
import dateFormat from "dateformat";
import PermissionToView from "~/components/profile/modal/PermissionToView.vue";
import SlideUpModal from "~/components/modals/SlideUpModal.vue";

export default Vue.extend({
  components: {
    SlideUpModal,
    EmptyFileLedger,
    FloatingActionButton,
    UploadDocumentModal,
    SearchIcon,
    ExportIcon,
    ShareIcon,
    PdfCCFlowModal,
    CopyIcon,
    FileSolidIcon,
    TrashCanIcon,
    CompanyIcon,
    RequestIcon,
    PlusIcon,
    MoveIcon,
    PenIcon,
    FolderPlusIcon,
    EllipsisIconVerticalIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    CreateCompanyFolder,
    PdfPapertagsModal,
    CreateTeam,
    EditCompanyFolder,
    EditCompanyFile,
    QrCode,
    DeleteCompanyFolder,
    AddCompanyfiles,
    RemoveCompanyFile,
    MoveCompanyFiles,
    SpinnerDottedIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    RequestModal,
    FilesFolder,
    MaxPaperlinkModal,
    QrcodeIcon,
    ArrowDownIcon,
    EyeIcon,
    MaxInviteModal,
    draggable,
    DragIcon,
    FileInFolder_,
  },
  name: "CompanyFileLedger",
  data() {
    return {
      showUploadDocumentModal: false,
      searchParam: "",
      returnedDataPage: 0,
      totalFile: null,
      showCreateCompanyFolder: false,
      showCreateTeam: false,
      showQrCode: false,
      showEditCompanyFolder: false,
      showEditCompanyFile: false,
      showDeleteCompanyFolder: false,
      folderProperty: "",
      showAddCompanyFiles: false,
      showRemoveCompanyFiles: false,
      showMoveCompanyFiles: false,
      showShareCompanyFiles: false,
      showQrcodeFiles: false,
      showCCFlowModal: false,
      showRequestModal: false,
      fileSpinner: true,
      folderSpinner: true,
      showPapertagsModal: false,
      folders: [],
      fileProps: {},
      userFile: {},
      refresh: false,
      show: false,
      fileLimit: 10,
      folderLimit: 10,
      folderSearch: "",
      fileSearch: "",
      returnedFolderPage: 0,
      totalFolder: null,
      showFilesInFolder: false,
      FilesInFolerContent: {},
      showUploadIcon: false,
      totalRegisteredPaperlink: null,
      showMaxPaperlinkModal: false,
      folderSelected: false,
      showFolders: false,
      actionFile: null,
      actionFolder: null,
      FileAction,
      debounceTimeout: null,
      maxInviteTeam: false,
      date: "",
      time: "",
      allowCopy: true,
      link: "",
      type: "",
      selectedFolderIndex: null,
      tabNumber: 1,
      isFolderTabSelected: false,
      totalPage: 0,
      showSearch: false,
      drag: false,
      totalPages: null,
      subscription: {},
      totalUserPages: 0,
      forlderDetails: {}
    };
  },
  methods: {
    async getTeamsOwnerFullDetail(){
      if(!this.$_teamOwner?.id) return
      const response = await this.$axios.get(`/users/${this.$_teamOwner?.ownersId}`)
      // this.totalUserPages = response.data?.totalPages
    },
    async removeAllFileWithoutAction(){
      let payload = {
                      action: "removeFileWithNoAction",
                      userId: localStorage.getItem('paperdaz_userID')
                    }
      await this.$axios.$post("/files", payload)
    },
    async getUserSubscription() {
      await this.$axios.get(`/subscriptions/?id=${this.$_userId}`)
        .then((res) => {
          this.subscription = res.data.data[0];
        });
    },
    handleShowSearch(){
      this.showSearch = !this.showSearch
      if(this.showSearch === false){
        this.fileSearch = '';
      this.folderSearch = ''
      }
    },
    actionFileInFolder: function (file) {
      this.actionFile = file;
    },
    seeAll() {
      this.returnedDataPage = 0;
      this.fileLimit = 1000000;
    },
    seeAllFolder() {
      this.returnedFolderPage = 0;
      this.folderLimit = 1000000;
    },
    getTotalPage() {
      // const numbers = this.files?.map((item) => item.pages);
    },
    switchFolderVisibility(item) {
      this.$axios
        .$patch(`/folders/${item.id}`, { isPrivate: !item.isPrivate })
        .then((response) => {
          this.$notify.success({
            title: "Folder",
            message: "Privacy changed successfully",
          });
          this.setRefresh();
        })
        .catch((err) => {
          this.$notify.error({
            title: "Folder",
            message: "Unable to change Privacy",
          });
        })
        .finally(() => {});
    },
    changeTab(num) {
      this.fileSearch = '';
      this.folderSearch = ''
      this.tabNumber = num;
      // this.setRefresh();
      if (num === 1) {
        this.fetchFiles(this.returnedDataPage, this.folderSearch);
        this.folderSelected = false;
        this.isFolderTabSelected = false;
        this.folderSelected = false;
        this.setRefresh();
      }
      if (num === 2) return (this.isFolderTabSelected = true);
    },
    emitPrivateModal(id, file) {
      this.$emit("showPermission", true, id, file);
    },
    routeToFileManager(val) {
      this.$router.push(val);
      localStorage.setItem("from_publicpage", JSON.stringify({ fromBusiness: false }));
    },
    async setAllowCopy() {
      await this.$axios.patch(`/users/${this.$auth?.user?.id}`, {
        allowCopy: this.allowCopy ? 1 : 0,
      });
    },

    onChange() {
      let orders = this.files.map((item, index) => {
        return {
          fileId: item.id,
          position: ++index,
        };
      });

      let payload = {
        action: "orderFiles",
        order: orders,
      };
      this.$forceUpdate();
      this.$axios.post("/files", payload);
    },
    onChangeFolder() {
      let orders = this.folders.map((item, index) => {
        return {
          folderId: item.id,
          position: ++index,
        };
      });

      let payload = {
        action: "orderFolder",
        order: orders,
      };
      this.$forceUpdate();
      this.$axios.post("/folders", payload);
    },
    async maxFileUpload() {
      this.$auth.user.subscriptionId &&
        (await this.$axios
          .get(`/subscriptions/${this.$_subscriptionId}`)
          .then((response) => {
            this.totalRegisteredPaperlink = response?.data?.paperlink;
          })
          .finally(() => {
            this.showUploadIcon = true;
          }));
    },
    showUploadModalFunction() {
      if (this.$auth.user?.totalPages > this.subscription?.paperlink)
        this.showMaxPaperlinkModal = true;
      else this.showUploadDocumentModal = true;
    },
    createdByTeamMember(val) {
      switch (this.$auth.user.role) {
        case UserTypeEnum.TEAM:
          if (this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE) return true;
          else if (this.$auth.user.teamAccess == TeamAccess.OWN_FILE)
            return this.$auth.user.id == val;
        case UserTypeEnum.PAID:
          return true;
      }
    },
    backFolder() {
      this.folderSelected = false;
      this.setRefresh();
    },
    showFolderFilesFunc(val) {
      this.FilesInFolerContent = val;
      this.files = val.files;
      this.folderSelected = true;
      // this.showFilesInFolder = true
      this.$store.commit("ADD_USER", this.FilesInFolerContent.files || []);
    },
    resetUserFolder() {
      this.fileProps = {};
    },
    resetUserFile() {
      this.userFile = {};
    },
    setFolderPage(val) {
      this.folderSpinner = true
      this.returnedFolderPage = val;
    },
    setPage(page) {
      this.returnedDataPage = page;
    },
    setRefresh() {
      this.refresh = !this.refresh;
      this.getTeamsOwnerFullDetail()
    },
    showCreateCompanyFolderFunc() {
      this.showCreateCompanyFolder = true;
    },
    showCreateTeamFunc() {
      this.showCreateTeam = true;
    },
    showMaxInviteTeam() {
      this.maxInviteTeam = true;
    },
    showEditCompanyFolderFunc(file) {
      this.fileProps = file;
      this.showEditCompanyFolder = true;
      this.actionFolder = null;
    },
    showEditCompanyFileFunc(file) {
      this.fileProps = file;
      this.showEditCompanyFile = true;
      this.actionFile = null;
    },
    showQrCodeFunc(file) {
      this.fileProps = file;
      this.showQrCode = true;
      this.actionFile = null;
    },
    showDeleteCompanyFolderFunc(file) {
      this.fileProps = file;
      this.showDeleteCompanyFolder = true;
      this.actionFolder = null;
    },
    showAddCompanyFolderFunc(file) {
      this.fileProps = file;
      this.showAddCompanyFiles = true;
      this.actionFolder = null;
    },
    showRemoveCompanyFileFunc(file) {
      this.userFile = file;
      this.showRemoveCompanyFiles = true;
      this.actionFile = null;
    },
    showMoveCompanyFileFunc(file) {
      this.userFile = file;
      this.showMoveCompanyFiles = true;
      this.actionFile = null;
    },
    showShareCompanyFileFunc(file) {
      this.userFile = file;
      this.showShareCompanyFiles = true;
      this.actionFile = null;
      this.link = `${window.origin}/pdf/${file.paperLink}`;
      this.type = `${file.fileName}`;
    },
    showPapertagsModalFunc(file) {
      this.userFile = file;
      this.showPapertagsModal = true;
      this.actionFile = null;
    },
    showCCFlowModalFunc(file) {
      this.userFile = file;
      this.showCCFlowModal = true;
      this.actionFile = null;
    },
    showRequestModalFunc(file) {
      this.userFile = file;
      this.showRequestModal = true;
      this.actionFile = null;
    },
    
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true;
    },
    formatDateTime(dateVal) {
      let date = dateFormat(dateVal, this.$store?.getters?.getDateFormat);
      let time = dateFormat(dateVal, this.$store?.getters?.getTimeFormat);
      return `${date}, ${time}`;
      // return `${DateFormatter.getDateString(
      //   dateVal
      // )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    async fetchFiles(page, search) {
      let paramsId = this.$_queryId;

      //<------------------- START: fetching of folder ------------>>
      await this.$axios
        .$post(`/files`, {
          action: "filesWithoutFolder",
          userId: paramsId,
          skip: this.returnedDataPage,
          limit: this.fileLimit,
          showDoNotPost: true,
          query:search,
          isDeleted: false
        })
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el;
          });

          this.files = filesData;
          this.$store.commit("ADD_USER", this.files);

          this.fileSpinner = false;
          this.totalFile = response.total;
          this.totalPages = response?.totalPages
        })
        .finally(() => {
          this.fileSpinner = false;
        });

      await this.$axios.$get(`/files?userId=${paramsId}`).then((response) => {
        this.$store.commit("SET_TOTALFILE", response.total);
      });
      //<------------------- START: fetching of folder ------------>>
    },
    async fetchFolder(page, search) {
      //---- checking the user role ---
      let paramsId = localStorage.getItem("team_id")
        ? localStorage.getItem("team_id")
        : this.$auth.user.id;
      //<------------------- START: fetching of folder ------------>>
      await this.$axios
        .$get(
          `/folders/?userId=${paramsId}&name[$like]=%${search}%&$sort[position]=1&$skip=${page}&$sort[createdAt]=-1&$limit=${this.folderLimit}`
        )
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el;
          });
          this.totalFolder = response.total;
          this.forlderDetails = response
          // set the data.file
          this.folders = filesData;
          // to stop spinner
          this.folderSpinner = false;
          let index = this.folders.findIndex(
            (item) => item.id == this.FilesInFolerContent.id
          );
          index != -1 && (this.FilesInFolerContent = this.folders[index]);
          console.log("from-folder-structure", this.folders[index], index);
        })
        .finally(() => {
          this.folderSpinner = false;
        });
      //<------------------- START: fetching of folder ------------>>
    },
  },
  mounted() {
    (this.date = this.$store.getters.getDateFormat),
      (this.time = this.$store.getters.getTimeFormat),
       this.removeAllFileWithoutAction();
       this.getUserSubscription()
      this.fetchFiles(this.returnedDataPage, this.folderSearch);
    this.fetchFolder(this.returnedFolderPage, this.folderSearch);
    this.maxFileUpload();
    this.allowCopy = this.$auth?.user?.allowCopy;
    this.getTeamsOwnerFullDetail()
  },
  filters: {
    removeExtension(filename) {
      return filename.replace(/\.pdf$/i, '');
    },
  },
  computed: {
    // getting state from the store
    ...mapState(["filterUser", "pdfUser"]),
    userType() {
      return UserTypeEnum;
    },
    isPaidUser() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return true;
        case UserTypeEnum.TEAM:
          return true;
        case UserTypeEnum.FREE:
          return false;
      }
    },
    teamMemberCanAccess() {
      switch (this.$auth.user.role + this.$auth.user.teamAccess) {
        case UserTypeEnum.TEAM + TeamAccess.OWN_FILE:
          return false;
        case UserTypeEnum.TEAM + TeamAccess.COMPANY_FILE:
          return true;
      }
    },
    isTeam() {
      if (!this.$auth.user.role) return null;
      return this.$auth.user.role == UserTypeEnum.TEAM;
    },
    mainUserLink() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return (this.$auth.user || {}).id;
        case UserTypeEnum.TEAM:
          return (this.$auth.user || {}).mainAccountId;
      }
      (this.$auth.user || {}).id;
    },
    allUserPages(){
      return this.totalPages 
    }
  },
  watch: {
    files() {
      this.getTotalPage();
    },
    allowCopy() {
      this.setAllowCopy();
    },
    refresh: function () {
      this.$nuxt.refresh();
      this.fetchFiles(this.returnedDataPage, this.folderSearch);
      this.fetchFolder(this.returnedFolderPage, this.folderSearch);
    },
    returnedDataPage: function () {
      this.fileSpinner = true;
      this.fetchFiles(this.returnedDataPage, this.folderSearch);
    },
    returnedFolderPage: function () {
      this.folderSpinner = true;
      this.fetchFolder(this.returnedFolderPage, this.folderSearch);
    },
    folderSearch: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.folderSpinner = true;
        this.fetchFolder(this.returnedFolderPage, this.folderSearch);
        // this.fileSpinner = true;
        // this.fetchFiles(this.returnedDataPage, this.folderSearch);
      }, 500);
    },
    fileSearch: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        // this.folderSpinner = true;
        // this.fetchFolder(this.returnedFolderPage, this.folderSearch);
        this.fileSpinner = true;
        this.fetchFiles(this.returnedDataPage, this.fileSearch);
      }, 500);
    },
   
    fileLimit: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        // this.folderSpinner = true;
        // this.fetchFolder(this.returnedFolderPage, this.folderSearch);
        this.fileSpinner = true;
        this.fetchFiles(this.returnedDataPage, this.fileSearch);
      }, 500);
    },
    folderLimit: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        // this.folderSpinner = true;
        // this.fetchFolder(this.returnedFolderPage, this.folderSearch);
        this.folderSpinner = true;
      this.fetchFolder(this.returnedFolderPage, this.folderSearch);
      }, 500);
    },
    showSearch: function () {
     if(this.showSearch === false) {
      this.fileSearch = ''
      this.folderSearch = ''

     }
    },
    "$auth.user": function () {
      this.fetchFiles(this.returnedDataPage, this.folderSearch);
      this.fetchFolder(this.returnedFolderPage, this.folderSearch);
      this.maxFileUpload();
      this.allowCopy = this.$auth?.user?.allowCopy;
    },
  },
});
</script>
<style lang="postcss" scoped>
.no-access {
  @apply p-2 text-[14px] capitalize;
}
.dropdown-item {
  border-top: 1px;
}
.custom-table {
  height: fit-content;
  --background: white;
  @apply max-sm:text-xs sm:text-base w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;
  height: fit-content;
  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }
  & th {
    @apply max-sm:pt-4 max-sm:pb-1 sm:pt-8 sm:pb-3 max-sm:text-xs sm:text-base;
    background: var(--background);
  }
  & td {
    @apply py-3 max-sm:text-xs sm:text-base;
  }
  & td,
  & th {
    @apply px-1 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    &:first-child {
      @apply pl-5;
    }
    &:last-child {
      @apply pr-5;
    }
    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);
      &.left {
        left: -0.1px;
      }
      &.right {
        right: -0.1px;
      }
    }
  }
}
input[type="checkbox"] {
  filter: hue-rotate(250deg);
}

.tab {
  @apply w-[70px] md:w-[120px] text-[0.8rem] md:text-[0.9rem] cursor-pointer flex font-[500] items-center pl-[8px] text-[#000] border-[#77B550] rounded-t-[10px] shadow-lg border-[2px] h-[25px] bg-[#fff] pt-1;
}

.active-tab {
  @apply tab !bg-[#77B550]  !text-white;
}
.pages {
  @apply text-paperdazgreen-300 ml-1 text-sm;
}
</style>
