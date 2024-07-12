<template>
  <div class="div_wrapper flex-wrap relative max-sm:absolute max-sm:bottom-5 max-sm:z-50">
    <div
      class="w-full py-1 pb-2 md:bg-gray-200 bg-lime-200 flex items-center md:justify-between justify-left"
      v-if="isConfirm && !isCreator && (!isConfirmChecked || !isScrollBottom)"
    >
      <!-- <span class="float-left pt-2 px-2">Scroll to the bottom of file to confirm that you have read.</span> -->
      <span class="w-11/12 py-1 px-2">
        <input type="checkbox" class="ml-1" @change="confrimStart" />
        I agree to confirm that I have read this file by applying my e-signature
        to this document.
      </span>
      <!-- <button class="text-white bg-zinc-500 rounded px-4 py-2 float-right mr-2" @click="cancelConfrim">Cancel</button> -->
    </div>
    <div
      class="flex justify-between items-center h-full bg-paperdazgreen-230 w-full"
      v-if="!isCreator && isSign && isAgreedSign === -1"
    >
      <span class="m-2 text-[10px] lg:text-sm font-bold d-flex"
        >
        <input type="checkbox" class="ml-1 mr-2" @change="checkBoxChange"/>
        I agree to apply my electronic signatures.
      </span>
    </div>
    <div
      v-else-if="userRole == 'free_user' && isSign && isAgreedSign === 1"
      class="h-full pt-2 font-bold pl-2 text-[#77b450]"
    >
      You can sign and initials now.
    </div>
    <div
      v-else-if="userRole == 'free_user' && isSign && isAgreedSign === 0"
      class="h-full pt-2 font-bold pl-2 text-[#77b450]"
    >
      You can't sign and initials action.
    </div>


       
    <div  
    class="md:hidden justify-between items-center flex w-full px-2"
    v-if="(!isLoading && !isCreator && !isComplete) && (isSign && isAgreedSign === 1 || isSign && isConfirmChecked)" >
      <button
        @click="$emit('togglepdfViewScale', 'none')"
        class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-4 max-sm:!px-2 tool-item text-sm bg-white text-red-500 lg:hidden"
      >
        <img src="./assets/scale_icon.svg" />
      </button>

      <button
      @click="$emit('cancel')"
      class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500 md:hidden"
    >
      Cancel
    </button>
    </div>



    <div
      v-if="!isLoading && !isCreator && isComplete"
      class="flex flex-wrap items-center justify-between md:w-full gap-x-1 gap-y-2 text-[#757575] text-base sm:text-2xl hidden px-2"
      :class="[isConfirm ? 'py-0' : 'pt-1']"
    >
      <!-- <button class="rounded h-10 w-10 bg-white text-[35px] font-[200]" @click="$emit('togglepdfViewScale', 'zoomout')">-</button> -->
      <div class="flex items-center">
        <template>
          <button
            @click="$emit('cancel')"
            class="tool rounded-lg h-8 sm:h-10 gap-1 py-1 px-3 max-sm:!px-3 tool-item text-sm bg-white text-red-500"
          >
            Cancel
          </button>

          <button
            class="h-8 w-20 text-sm flex items-center justify-center rounded-l-lg"
            :class="[
              activeTool == TOOL_TYPE.text
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
              isCreator ? 'opacity-40' : 'opacity-100',
            ]"
            @click="setSelectedType(TOOL_TYPE.text)"
          >
            <pdf-text-tool-icon width="20" height="20" />
            <abbr class="ml-2">Type</abbr>
          </button>
          <div class="h-8 w-28 text-sm relative">
            <span
              class="inline-flex w-full h-full rounded-r-md bg-white overflow-hidden"
            >
              <button
                class="h-8 w-12 flex justify-center items-center"
                :class="[
                  activeTool == initialIcon?.type
                    ? 'bg-paperdazgreen-300 text-white'
                    : 'bg-white',
                  isCreator ? 'opacity-40' : '',
                ]"
                @click="setSelectedType(initialIcon?.type)"
              >
                <component :is="initialIcon?.component" />
              </button>
              <button
                :class="[showDropDown ? 'turn-up' : 'turn-down']"
                @click="showDropDown = !showDropDown"
                class="h-8 w-16 bg-white flex justify-center items-center line-side"
              >
                <img src="../pdf/assets/chevron_down.svg" />
              </button>
            </span>
            <div
              class="drop-down-action shadow-md"
              :class="[showDropDown ? 'h-[80px]' : 'h-[0px]']"
            >
              <button
                v-for="tool in toolsDropdowm"
                :key="tool.type"
                class="rounded h-10 w-12 flex justify-center items-center relative"
                :class="[
                  activeTool == tool.type
                    ? 'bg-paperdazgreen-300 text-white'
                    : 'bg-white',
                  isCreator ? 'opacity-40' : '',
                  tool.color,
                ]"
                @click="setSelectedType(tool.type)"
              >
                <component :is="tool.component" />
              </button>
            </div>
          </div>

          <button
            @click="saveChanges"
            class="tool rounded-lg h-8 sm:h-10 gap-1 py-1 px-3 max-sm:!px-3 tool-item text-sm bg-paperdazgreen-300 text-white text-red-500"
          >
            Done
          </button>
        </template>
      </div>
      <!-- <button class="rounded h-10 w-10 bg-neutral-700 text-white text-[32px] font-[200]" @click="$emit('togglepdfViewScale', 'zoomin')">+</button> -->
    </div>
    <div
      v-if="!isLoading && !isCreator && isComplete"
      class="tools-container-wrapper flex flex-wrap items-center justify-around w-full text-[#757575] text-base sm:text-2xl sm:hidden px-0 hidden"
      :class="[isConfirm ? 'py-0' : 'py-0']"
    >
      <div class="overflow-x-auto flex items-center">
        <div class="flex items-center">
          <button
            class="tool rounded-full h-8 w-20 flex items-center gap-2 py-1 px-4 text-xs"
            :class="[
              activeTool == TOOL_TYPE.signature
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
              isCreator ? 'opacity-40' : '',
            ]"
            @click="setSelectedType(TOOL_TYPE.signature)"
          >
            <img src="./assets/draw_tool.svg" width="18" class="p-[2px]" />
            Sign
          </button>
          <button
            class="rounded-full h-8 w-20 text-xs"
            :class="[
              activeTool == TOOL_TYPE.date
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
              isCreator ? 'opacity-40' : '',
            ]"
            @click="setSelectedType(TOOL_TYPE.date)"
          >
            <calendar-icon class="mr-1" /> Date
          </button>
          <button
            @click="$emit('togglepdfViewScale', 'none')"
            class="tool rounded-md h-8 flex items-center gap-1 py-1 px-4 max-sm:!px-2 tool-item text-sm bg-white text-red-500 lg:hidden"
          >
            <img src="./assets/scale_icon.svg" />
          </button>
          <div class="mx-1">
            <button
              class="rounded-full h-8 w-20 flex items-center gap-2 py-1 px-4 tool-item text-xs"
              :class="[
                activeTool == TOOL_TYPE.initial
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
                isCreator ? 'opacity-40' : '',
              ]"
              @click="setSelectedType(TOOL_TYPE.initial)"
            >
              <img src="./assets/initial_tool.svg" width="18" class="p-[2px]" />
              Initials
            </button>
          </div>
          <button
            @click="undoFunction"
            class="rounded-[50px] h-8 bg-white text-sm px-2"
          >
            <img src="../svg-icons/UndoIcon.svg" class="w-[15px] mr-2" />
            UNDO
          </button>
        </div>
      </div>
    </div>
    
    <div class=" overflow-hidden flex sm:hidden w-full h-screen bg-black opacity-80 " v-if="showCompleteToolAction">
      <div class="relative justify-center w-full h-100 bottom-0">
        <div class="flex flex-wrap justify-between mb-[9rem] w-full px-5 absolute bottom-20">
          <button
            class="tools"
            @click="$emit('creatorPublishFile')"
          >
            Publish
          </button>
          <button
            class="tools"
            @click="onReset('clear')"
          >
            Clear
          </button>
        </div>
      <div class="flex flex-wrap justify-between mb-[9rem] w-full px-5 absolute bottom-0">
          <button
            class="tools"
            @click="undoFunction"
          >
            <img src="../svg-icons/UndoIcon.svg" class="w-[15px] mr-2" />
            Undo
          </button>
          <button
            class="tools"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
      </div>

      </div>
      
    </div>
    <div class="bottom-0 overflow-hidden sm:hidden w-full h-screen bg-black opacity-80" v-if="showCompleteToolBar">
      <div class=" flex-row justify-center w-full mt-100 absolute bottom-20">
      
        <div class="flex flex-wrap justify-between w-full mb-5 px-5 ">
          <button
            class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
            :class="[
              activeTool == TOOL_TYPE.appendDate
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onDateClick"
          >
            <img
              src="../../assets/img/date_icon.svg"
              width="18"
              class="bg-slate-200 p-[2px]"
            />
            Date
          </button>
          <button
              class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
              :class="[
                activeTool == TOOL_TYPE.appendName
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onNameClick(TOOL_TYPE.appendName, index)"
            >
              <img
                src="../../assets/img/name_icon.svg"
                width="18"
                class="bg-slate-200 p-[2px]"
              />
              Full Name
          </button>
        </div>
        <div class="flex flex-wrap justify-between mb-5 w-full px-5 ">
          <button
            class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
            :class="[
              activeTool == TOOL_TYPE.appendSignature
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onSignClick"
          >
            <img
              src="../../assets/img/sign-icon.png"
              width="18"
              class="bg-slate-200 p-[2px]"
            />
            Sign
          </button>
          <button
              class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
              :class="[
                activeTool == TOOL_TYPE.appendFirstName
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onNameClick(TOOL_TYPE.appendFirstName, index)"
            >
              <img
                src="../../assets/img/first_name_tool.svg"
                width="18"
                class="bg-slate-200 p-[2px]"
              />
              First N.
          </button>
        </div>
        <div class="flex flex-wrap justify-between mb-5 w-full px-5 ">
          <button
            class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
            :class="[
              activeTool == TOOL_TYPE.appendInitial
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onInitialsClick"
          >
            <img
              src="../../assets/img/initial-icon.png"
              width="18"
              class="bg-slate-200 p-[2px]"
            />
            Initials
          </button>
          <button
              class="tool w-28 rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
              :class="[
                activeTool == TOOL_TYPE.appendLastName
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onNameClick(TOOL_TYPE.appendLastName, index)"
            >
              <img
                src="../../assets/img/last_name_tool.svg"
                width="18"
                class="bg-slate-200 p-[2px]"
              />
              Last N.
          </button>
        </div>
        <div class="flex flex-wrap justify-center mb-5 w-full px-5 ">
          <button
            class="tool w-28 rounded-md h-8 sm:h-10 flex sm:flex-row-reverse items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
            :class="[
              activeTool == TOOL_TYPE.star
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onImageClick"
          >
            <img
              src="../../assets/img/require-icon.png"
              width="18"
              class="bg-slate-200 p-[2px]"
            />
            Note
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!isLoading && !isCreator && isComplete"
      class="tools-container-wrapper hidden sm:flex flex-wrap justify-between w-full gap-x-1 gap-y-2 text-[#757575] text-base sm:text-2xl"
      :class="[isConfirm ? 'py-0' : 'py-2']"
    >
      <button
        class="rounded h-10 w-24 text-sm"
        :class="[
          activeTool == TOOL_TYPE.text
            ? 'bg-paperdazgreen-300 text-white'
            : 'bg-white',
          isCreator ? 'opacity-40' : 'opacity-100',
        ]"
        @click="setSelectedType(TOOL_TYPE.text)"
      >
        <pdf-text-tool-icon />
        <abbr class="ml-2">Type</abbr>
      </button>

      <div class="rounded h-10 w-20 text-sm relative">
        <span
          class="inline-flex w-full h-full rounded bg-white overflow-hidden"
        >
          <button
            class="h-10 w-10"
            :class="[
              activeTool == initialIcon?.type
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
              isCreator ? 'opacity-40' : '',
            ]"
            @click="setSelectedType(initialIcon?.type)"
          >
            <component :is="initialIcon?.component" />
          </button>
          <button
            :class="[showDropDown ? 'turn-up' : 'turn-down']"
            @click="showDropDown = !showDropDown"
            class="h-10 w-10 bg-white"
          >
            <img src="../pdf/assets/chevron_down.svg" />
          </button>
        </span>
        <div
          class="drop-down-action shadow-md"
          :class="[showDropDown ? 'h-[80px]' : 'h-[0px]']"
        >
          <button
            v-for="tool in toolsDropdowm"
            :key="tool.type"
            class="rounded h-10 w-10"
            :class="[
              activeTool == tool.type
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
              isCreator ? 'opacity-40' : '',
              tool.color,
            ]"
            @click="setSelectedType(tool.type)"
          >
            <component :is="tool.component" />
          </button>
        </div>
      </div>

      <button
        class="rounded h-10 w-[105px] sm:w-24 text-sm"
        :class="[
          activeTool == TOOL_TYPE.date
            ? 'bg-paperdazgreen-300 text-white'
            : 'bg-white',
          isCreator ? 'opacity-40' : '',
        ]"
        @click="setSelectedType(TOOL_TYPE.date)"
      >
        <calendar-icon />
        <abbr class="ml-2">Date</abbr>
      </button>
      <!-- <zoom-in-out @zoomIn="$emit('zoomIn')" @zoomOut="$emit('zoomOut')" /> -->
      <div class="mx-1">
        <button
          class="rounded h-10 w-[105px] sm:w-24 flex items-center gap-2 py-1 px-4 text-sm"
          :class="[
            activeTool == TOOL_TYPE.appendSignature
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
            isCreator ? 'opacity-40' : '',
          ]"
          @click="onSignClick"
        >
          <img src="../svg-icons/PdfSignTool.svg" width="18" />
          Sign
        </button>
      </div>

      <div class="mx-1">
        <button
          class="rounded h-10 w-[105px] sm:w-24 flex items-center gap-2 py-1 px-4 tool-item text-sm"
          :class="[
            activeTool == TOOL_TYPE.appendInitial
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
            isCreator ? 'opacity-40' : '',
          ]"
          @click="onInitialsClick"
        >
          <img src="../svg-icons/PdfinitialTool.svg" width="18" />
          Initials
        </button>
      </div>

      <button @click="undoFunction" class="rounded h-10 bg-white text-sm">
        <img src="../svg-icons/UndoIcon.svg" class="w-[15px] mr-2" />
        UNDO
      </button>
    </div>
    <div class="hidden sm:block md:w-full w-11/12">
      <div
        v-if="isComplete && isCreator && $auth.loggedIn"
        class="md:w-full w-11/12 flex items-center justify-between py-1 flex-wrap md:flex-nowrap"
      >
        <button
          class="tool rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
          :class="[
            activeTool == TOOL_TYPE.appendSignature
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
          ]"
          @click="onSignClick"
        >
          <img
            src="../../assets/img/sign-icon.png"
            width="18"
            class="bg-slate-200 p-[2px]"
          />
          Sign
        </button>
        <button
          class="tool rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
          :class="[
            activeTool == TOOL_TYPE.appendInitial
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
          ]"
          @click="onInitialsClick"
        >
          <img
            src="../../assets/img/initial-icon.png"
            width="18"
            class="bg-slate-200 p-[2px]"
          />
          Initials
        </button>
        <button
          class="tool rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
          :class="[
            activeTool == TOOL_TYPE.appendDate
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
          ]"
          @click="onDateClick"
        >
          <img
            src="../../assets/img/date_icon.svg"
            width="18"
            class="bg-slate-200 p-[2px]"
          />
          Date
        </button>

        <div class="w-auto relative tool">
          <div class="w-auto flex bg-white rounded-md">
            <button
              class="rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
              :class="[
                activeTool == initialNameIcon?.type
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onNameClick(initialNameIcon?.type)"
            >
              <img
                :src="require(`../../assets/img/${initialNameIcon.component}`)"
                width="18"
                class="bg-slate-200 p-[2px]"
              />
              {{ initialNameIcon?.title }}
            </button>
            <button
              :class="[showNameDropDown ? 'turn-up' : 'turn-down']"
              @click="showNameDropDown = !showNameDropDown"
              class="name_dropdown"
            >
              <img src="../pdf/assets/chevron_down.svg" />
            </button>
          </div>
          <div v-show="showNameDropDown" class="absolute top-full z-10">
            <button
              v-for="(nameIcon, index) in filterednamesDropdown"
              :key="nameIcon.title"
              class="rounded-md sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm shadow-sm mt-[3px] w-full"
              :class="[
                activeTool == nameIcon?.type
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onNameClick(nameIcon?.type, index)"
            >
              {{ nameIcon?.title }}
            </button>
          </div>
        </div>

        <button
          class="tool rounded-md h-8 sm:h-10 flex sm:flex-row-reverse items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
          :class="[
            activeTool == TOOL_TYPE.star
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-white',
          ]"
          @click="onImageClick"
        >
          Note
          <img
            src="../../assets/img/require-icon.png"
            width="18"
            class="bg-slate-200 p-[2px]"
          />
        </button>

        <div class="w-auto relative tool inline-block md:hidden">
          <div class="w-auto flex bg-white rounded-md text-red-500">
            <button
              class="rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
              :class="[
                activeTool == initialResetIcon?.type
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
              @click="onReset(initialResetIcon?.type)"
            >
              <img
                v-show="initialResetIcon.type == 'undo'"
                src="./assets/undo_icon.svg"
                width="24"
              />
              {{ initialResetIcon.title }}
            </button>
            <button
              :class="[showResetdropdown ? 'turn-up' : 'turn-down']"
              @click="showResetdropdown = !showResetdropdown"
              class="name_dropdown"
            >
              <img src="../pdf/assets/chevron_down.svg" />
            </button>
          </div>
          <div
            v-show="showResetdropdown"
            class="absolute top-full z-10 w-full text-red-500"
          >
            <button
              v-for="(reset, index) in resetDropdown"
              :key="reset.title"
              v-if="reset.type != initialResetIcon.type"
              @click="resetAction(reset.type)"
              class="rounded-md sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm shadow-sm mt-[3px] w-full"
              :class="[
                activeTool == reset?.type
                  ? 'bg-paperdazgreen-300 text-white'
                  : 'bg-white',
              ]"
            >
              {{ reset?.title }}
            </button>
          </div>
        </div>
        <button
          @click="undoFunction"
          class="tool rounded-md h-8 sm:h-10 items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500 hidden md:inline-flex"
        >
          <undo-icon />
          Undo
        </button>
        <button
          @click="$emit('togglepdfViewScale', 'none')"
          class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-4 max-sm:!px-2 tool-item text-sm bg-white text-red-500 lg:hidden"
        >
          <img src="./assets/scale_icon.svg" />
        </button>
        <button
          @click="$emit('cancel')"
          class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500 md:hidden"
        >
          Cancel
        </button>
        <button
        @click="$emit('creatorPublishFile')"
        class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-5 max-sm:!px-1 tool-item text-sm bg-paperdazgreen-300 text-white md:hidden"
      >
        Publish
      </button>
      </div>

    </div>
    <div
      class="flex w-full sm:hidden bg-zinc-200 flex-row-reverse justify-between items-center p-1"
      v-if="isComplete && isCreator && $auth.loggedIn"
      >
        <div class="flex item-center justify-between h-12 px-3 py-0.5 w-full">
          <button
            @click="displayCompleteToolAction"
            :class="[activebottomTool == 1 ? 'z-[100000]' : null]"
            class="action-button_D"
          >
            A
          </button>
          <button @click="$emit('togglepdfViewScale', 'none')" class="action-button_A text-[1.4em]">
            +
          </button>
          <button @click="$emit('togglepdfViewScale', 'none')" class="action-button_A">
            <img
              src="@/components/pdf/assets/scale_icon.svg"
              class="w-[1.4em]"
            />
          </button>
          <button @click="$emit('togglepdfViewScale', 'none')" class="action-button_A text-[1.6em]">
            -
          </button>
          <button
            @click="displayCompleteToolBar"
            :class="[activebottomTool == 2 ? 'z-[100000]' : null]"
            class="action-button_D"
          >
            S
          </button>
        </div>
    </div>


    <div
      v-if="isSign && isCreator && $auth.loggedIn"
      class="flex items-center justify-between flex-wrap py-1 md:w-full w-11/12"
    >
      <button
        @click="onSignClick"
        class="rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
        :class="[
          activeTool == TOOL_TYPE.appendSignature
            ? 'bg-paperdazgreen-300 text-white'
            : 'bg-white',
        ]"
      >
        <img
          src="../../assets/img/sign-icon.png"
          width="18"
          class="bg-slate-200 p-[2px]"
        />
        Sign
      </button>
      <button
        class="rounded-md h-8 sm:h-10 flex  items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
        :class="[
          activeTool == TOOL_TYPE.appendInitial
            ? 'bg-paperdazgreen-300 text-white'
            : 'bg-white',
        ]"
        @click="onInitialsClick"
      >
        <img
          src="../../assets/img/initial-icon.png"
          width="18"
          class="bg-slate-200 p-[2px]"
        />
        Initials
      </button>
      <button
        class="rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
        :class="[
          activeTool == TOOL_TYPE.appendDate
            ? 'bg-paperdazgreen-300 text-white'
            : 'bg-white',
        ]"
        @click="onDateClick"
      >
        <img
          src="../../assets/img/date_icon.svg"
          width="18"
          class="bg-slate-200 p-[2px]"
        />
        Date
      </button>
      <div class="w-auto relative tool">
        <div class="w-auto flex bg-white rounded-md">
          <button
            class="rounded-md h-8 sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm"
            :class="[
              activeTool == initialNameIcon?.type
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onNameClick(initialNameIcon?.type)"
          >
            <img
              :src="require(`../../assets/img/${initialNameIcon.component}`)"
              width="18"
              class="bg-slate-200 p-[2px]"
            />
            {{ initialNameIcon?.title }}
          </button>
          <button
            :class="[showNameDropDown ? 'turn-up' : 'turn-down']"
            @click="showNameDropDown = !showNameDropDown"
            class="name_dropdown"
          >
            <img src="../pdf/assets/chevron_down.svg" />
          </button>
        </div>
        <div v-show="showNameDropDown" class="absolute top-full z-10">
          <button
            v-for="(nameIcon, index) in filterednamesDropdown"
            :key="nameIcon.title"
            class="rounded-md sm:h-10 flex items-center gap-2 py-1 px-3 max-sm:!px-1 tool-item text-sm shadow-sm mt-[3px] w-full"
            :class="[
              activeTool == nameIcon?.type
                ? 'bg-paperdazgreen-300 text-white'
                : 'bg-white',
            ]"
            @click="onNameClick(nameIcon?.type, index)"
          >
            {{ nameIcon?.title }}
          </button>
        </div>
      </div>

      <button
        @click="undoFunction"
        class="rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500"
      >
        <undo-icon />
        Undo
      </button>
      <!-- <button
        @click="onReset('clear')"
        class="rounded-md h-8 sm:h-10 items-center gap-1 py-1 max-sm:!px-3 tool-item text-sm bg-white text-red-500 inline-flex md:hidden"
      >
        Clear
      </button> -->
      <button
        @click="$emit('togglepdfViewScale', 'none')"
        class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-4 max-sm:!px-2 tool-item text-sm bg-white text-red-500 lg:hidden"
      >
        <img src="./assets/scale_icon.svg" />
      </button>
      <button
        @click="$emit('cancel')"
        class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500 md:hidden"
      >
        Cancel
      </button>
      <button
      @click="$emit('creatorPublishFile')"
      class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-5 max-sm:!px-1 tool-item text-sm bg-paperdazgreen-300 text-white md:hidden"
    >
      Publish
    </button>
    </div>
    <!-- <div
     v-if="openAnnotationToolInput"
     class="relative z-10 w-full py-1 bg-white text-sm px-3 mb-1 sm:hidden">
      <input v-model="toolValue"
      @focus="isFocus = true"
      @blur="isFocus = false"
      placeholder="active text content display"
      class="outline-none border-none w-full"/>
    </div> -->

    <div  v-if="isConfirm && isCreator && $auth.loggedIn"
    class="flex items-center justify-between flex-wrap py-1 md:w-full w-11/12"
    >
      <button
      @click="$emit('cancel')"
      class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-3 max-sm:!px-1 tool-item text-sm bg-white text-red-500 md:hidden"
    >
      Cancel
    </button>
      <button
      @click="$emit('togglepdfViewScale', 'none')"
      class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-4 max-sm:!px-2 tool-item text-sm bg-white text-red-500 lg:hidden"
    >
      <img src="./assets/scale_icon.svg" />
    </button>
    <button
    @click="$emit('creatorPublishFile')"
    class="tool rounded-md h-8 sm:h-10 flex items-center gap-1 py-1 px-5 max-sm:!px-1 tool-item text-sm bg-paperdazgreen-300 text-white md:hidden"
  >
    Publish
  </button>
    </div>


    <draw-or-type-modal
      v-model="showSignatureModal"
      :label="openSignType"
      @image-exported="imageExportedLocal($event, true)"
      use-default-button
    />
    <draw-or-type-modal
      v-model="showInitialsModal"
      :label="openSignType"
      @image-exported="imageExportedLocal($event, false)"
      use-default-button
    />
    <div v-if="isLoading" class="w-full bg-paperdazgray-200 text-center">
      Loading PDF...  
    </div>
    <pdf-not-logged-user v-model="showPdfNotLoggedInUser" />
    <AlertModal v-model="showAlert" />
  </div>
</template>

<script>
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import FileAction from '~/models/FileAction'
import TeamAccess from '~/models/TeamAccess'
import DrawOrTypeModal from '../modals/DrawOrTypeModal.vue'
import CalendarIcon from '../svg-icons/CalendarIcon.vue'
import ExclamationIcon from '../svg-icons/ExclamationIcon.vue'
import HollowCircleIcon from '../svg-icons/HollowCircleIcon.vue'
import PdfHighlightToolIcon from '../svg-icons/PdfHighlightToolIcon.vue'
import PdfPenToolIcon from '../svg-icons/PdfPenToolIcon.vue'
import PdfRectangleToolIcon from '../svg-icons/PdfRectangleToolIcon.vue'
import PdfTextToolIcon from '../svg-icons/PdfTextToolIcon.vue'
import PdfTickIcon from '../svg-icons/PdfTickIcon.vue'
import PdfTimesIcon from '../svg-icons/PdfTimesIcon.vue'
import SolidCircleIcon from '../svg-icons/SolidCircleIcon.vue'
import StarIcon from '../svg-icons/StarIcon.vue'
import UserProfileSolidIcon from '../svg-icons/UserProfileSolidIcon.vue'
import TOOL_TYPE from './data/toolType'
import PdfNotLoggedUser from './modals/PdfNotLoggedUser.vue'
import AlertModal from './modals/AlertModal.vue'
import initialURL from '~/assets/img/initials.png'
import signatureURL from '~/assets/img/sign.png'
import ZoomInOut from '@/components/pdf/ZoomInOut'
import GroupTools from '../svg-icons/GroupTools.vue'
import GroupInsert from '../svg-icons/GroupInsert.vue'
import UndoIcon from '../svg-icons/UndoIcon.vue'

export default {
  components: {
    DrawOrTypeModal,
    PdfTextToolIcon,
    PdfTickIcon,
    PdfTimesIcon,
    SolidCircleIcon,
    HollowCircleIcon,
    PdfRectangleToolIcon,
    PdfHighlightToolIcon,
    PdfPenToolIcon,
    CalendarIcon,
    UserProfileSolidIcon,
    StarIcon,
    ExclamationIcon,
    PdfNotLoggedUser,
    AlertModal,
    ZoomInOut,
    GroupTools,
    GroupInsert,
    UndoIcon,
  },
  mixins: [SaveSignatureInitialsMixin],
  data: () => ({
    showAlert: false,
    selectedType: null,
    activeTool: '',
    components: { PdfTextToolIcon },
    signaturePad: false,
    showSignatureModal: false,
    showInitialsModal: false,
    showPdfNotLoggedInUser: false,
    signAgreeChecked: false,
    initial: null,
    signature: null,
    showInitialTray: false,
    showSignTray: false,
    showInsertTools: false,
    isConfirmChecked: false,
    showDropDown: false,
    showNameDropDown: false,
    agreedConfirmPolicy: false,
    showResetdropdown: false,
    showCompleteToolAction: false,
    showCompleteToolBar: false,

    filteredResetDropdown: [],
    isFocus: false,
    toolValue: "",
    initialIcon: {
      type: TOOL_TYPE.tick,
      component: 'pdf-tick-icon',
      color: 'text-black',
    },
    initialNameIcon: {
      type: TOOL_TYPE.appendName,
      component: 'name_icon.svg',
      color: 'text-black',
      title: 'Full Name',
    },
    initialResetIcon: {
      type: 'undo',
      component: null,
      color: 'text-black',
      title: 'Undo',
    },
    nameDropdowm: [
      {
        type: TOOL_TYPE.appendName,
        component: 'name_icon.svg',
        color: 'text-black',
        title: 'Full Name',
      },
      {
        type: TOOL_TYPE.appendFirstName,
        component: 'first_name_tool.svg',
        color: 'text-black',
        title: 'First Name',
      },
      {
        type: TOOL_TYPE.appendLastName,
        component: 'last_name_tool.svg',
        color: 'text-black',
        title: 'Last Name',
      },
    ],
    resetDropdown: [
      {
        type: 'clear',
        component: null,
        color: 'text-black',
        title: 'Clear',
      },
      {
        type: 'undo',
        component: '../../assets/img/undo_icon.svg',
        color: 'text-black',
        title: 'Undo',
      },
    ],
    toolsDropdowm: [
      {
        type: TOOL_TYPE.cross,
        component: 'pdf-times-icon',
        color: 'text-black',
      },
      // {
      //   type: TOOL_TYPE.circle,
      //   component: 'hollow-circle-icon',
      //   color: 'text-black',
      // },
      {
        type: TOOL_TYPE.dot,
        component: 'solid-circle-icon',
        color: 'text-black',
      },
      // {
      //   type: TOOL_TYPE.line,
      //   component: 'pdf-rectangle-tool-icon',
      //   color: 'text-black'
      // },
      // {
      //   type: TOOL_TYPE.highlight,
      //   component: 'pdf-highlight-tool-icon',
      //   color: 'text-[#FFCF27]'
      // },
      // {
      //   type: TOOL_TYPE.draw,
      //   component: 'pdf-pen-tool-icon',
      //   color: 'text-black'
      // }
    ],
  }),
  props: {
    file: {
      type: Object,
      required: true,
    },
    tools: { type: Array },
    isLoading: {
      type: Boolean,
      default: true,
    },
    isCreator: Boolean,
    selectedToolType: {},
    openTypeSignModal: Boolean,
    openSignType: String,
    openTypeInitialModal: Boolean,
    inputValue: Function,
    canShowToolbarTextInput: Boolean,
    openAnnotationToolInput: Boolean,
  },
  emits: ['zoomOut', 'zoomIn', 'cancel', 'confirmChecked'],
  computed: {
    checkInitialDisplay() {
      return this.tools.length
    },
    filterednamesDropdown() {
      return this.nameDropdowm.filter(
        (item) => item.title != this.initialNameIcon.title
      )
    },
    TOOL_TYPE() {
      return TOOL_TYPE
    },
    FrombusinessPage() {
      return (
        JSON.parse(localStorage.getItem('from_publicpage') || '{}')?.fromBusiness ?? true
      )
    },
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isScrollBottom() {
      return this.$store.state.scrollPosition
    },
    userRole() {
      return this.$auth?.user?.role || ''
    },
    isAgreedSign() {
      return this.$store.state.agreeSign
    },
  },
  methods: {
    onReset(val) {
      switch (val) {
        case 'clear':
          this.$emit('clearAnnotations')
          break
        case 'undo':
          this.undoFunction()
          break
      }
    },
    displayCompleteToolAction() {
      this.showCompleteToolAction
        ? (this.showCompleteToolAction = false)
        : (this.showCompleteToolAction = true)
      this.activebottomTool = 1
    },
    scaleOut() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer']?.getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (curParentWidth > iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },
    scaleIn() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer']?.getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (curParentWidth == iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },
    displayCompleteToolBar() {
      this.showCompleteToolBar
        ? (this.showCompleteToolBar = false)
        : (this.showCompleteToolBar = true)
      this.activebottomTool = 2
    },
    resetAction(val) {
      this.initialResetIcon = this.resetDropdown.find((v) => v.type == val)
      this.onReset(val)
      this.showResetdropdown = false
    },
    saveChanges() {
      this.$emit('pinchZoomOut')
      this.$store.commit('SET_UPLOAD_STATE', false)
      this.saveFunction = 'saved'
      this.$emit('publishFileFunction')
    },
    handleKeyDown(event) {
      if (event.ctrlKey && event.key === 'z') {
        this.undoFunction()
      }
    },
    onImageClick() {
      if (this.isCreator) {
        this.setSelectedType(this.TOOL_TYPE.star)
      }
    },
    onDateClick() {
      if (this.isCreator) {
        this.setSelectedType(this.TOOL_TYPE.appendDate)
      }
    },
    onNameClick(val, index) {
      if (this.isCreator) {
        this.setSelectedType(val)
        const index = this.nameDropdowm.findIndex((v) => v.type == val)
        this.initialNameIcon = this.nameDropdowm[index]
        this.showNameDropDown = false
      }
    },
    handleInitialFocusOut(e) {
      if (e.target.id !== 'initialtraybtn') {
        this.showInitialTray = false
      }
    },
    handleSignFocusOut(e) {
      if (e.target.id !== 'signtraybtn') {
        this.showSignTray = false
      }
    },
    signContinue() {
      if (this.signAgreeChecked) {
        this.$store.commit('SET_AGREE_SIGN', 1)
        // this.$emit('check-active-tools')
      } else {
        this.showAlert = true
      }
    },
    signCancel() {
      this.$store.commit('UN_SET_AGREE_SIGN')
      this.$emit('cancel')
    },
    checkBoxChange(e) {
      this.signAgreeChecked = e.target.checked
      this.signContinue()
    },
    allowAnnotationsSign_Initial(type) {
      switch (this.isCreator && (this.isComplete || this.isSign)) {
        case true:
          if (type == this.TOOL_TYPE.appendSignature)
            return type == this.TOOL_TYPE.appendSignature
          else if (type == this.TOOL_TYPE.appendInitial)
            return type == this.TOOL_TYPE.appendInitial
          else if (type == this.TOOL_TYPE.star)
            return type == this.TOOL_TYPE.star
          else if (type == this.TOOL_TYPE.appendDate)
            return type == this.TOOL_TYPE.appendDate
          else if (type == this.TOOL_TYPE.appendName)
            return type == this.TOOL_TYPE.appendName
          else if (type == this.TOOL_TYPE.appendFirstName)
            return type == this.TOOL_TYPE.appendFirstName
          else if (type == this.TOOL_TYPE.appendLastName)
            return type == this.TOOL_TYPE.appendLastName
        default:
          return this.isCreator ? false : true
      }
    },
    undoFunction() {
      this.$emit('undo')
      this.$forceUpdate()
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      this.imageExported(image, isSignature)
    },
    setSelectedType(type) {
      if (!this.$auth.loggedIn && !this.$store.getters?.getFillAsGuest) {
        !this.$auth.loggedIn ? this.$store.getters.showGuestModal() : null
        return
      }
      if (!this.allowAnnotationsSign_Initial(type)) return

      if (this.selectedType == type && this.selectedType != this.TOOL_TYPE.star) this.selectedType = null
      else this.selectedType = type
      this.$emit('tool-change', this.selectedType)
      this.activeTool = this.selectedType || ''
    },
    downloadPdf() {
      this.$BUS.$emit('download-pdf')
    },
    onSignClick() {
      if (!this.$auth.loggedIn && !this.$store.getters?.getFillAsGuest) {
        !this.$auth.loggedIn ? this.$store.getters.showGuestModal() : null
        return
      }

      this.setSelectedType(this.TOOL_TYPE.appendSignature)
    },
    openSignModal() {
      if (!this.isCreator) {
        this.showSignatureModal = true
      }
    },
    openInitialModal() {
      if (!this.isCreator) {
        this.showInitialsModal = true
      }
    },
    onInitialsClick() {
      if (!this.$auth.loggedIn && !this.$store.getters?.getFillAsGuest) {
        !this.$auth.loggedIn ? this.$store.getters.showGuestModal() : null
        return
      }

      this.setSelectedType(this.TOOL_TYPE.appendInitial)
    },
    cancelConfrim() {
      window.location.assign('/paperlink-pages')
    },
    changeInitialToBase64() {
      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
          )
      this.$auth?.user?.initialURL
        ? toDataURL(this.$auth?.user?.initialURL).then((dataUrl) => {
            this.initial = dataUrl
          })
        : toDataURL(initialURL).then((dataUrl) => {
            this.initial = dataUrl
          })
      this.$auth?.user?.signatureURL
        ? toDataURL(this.$auth?.user?.signatureURL).then((dataUrl) => {
            this.signature = dataUrl
          })
        : toDataURL(signatureURL).then((dataUrl) => {
            this.signature = dataUrl
          })
    },
    confrimStart(e) {
      if (!this.$auth.loggedIn && !this.$store.getters?.getFillAsGuest) {
        this.$store.getters.showGuestModal()
        e.target.checked = false
        return
      }

      this.isConfirmChecked = e.target.checked
      this.$emit('confirmChecked', e.target.checked)
    },
  },
  watch: {
    selectedType() {
      if (
        this.selectedType == TOOL_TYPE.appendDate ||
        this.selectedType == TOOL_TYPE.appendInitial ||
        this.selectedType == TOOL_TYPE.appendSignature ||
        this.selectedType == TOOL_TYPE.appendName ||
        this.selectedType == TOOL_TYPE.appendFirstName ||
        this.selectedType == TOOL_TYPE.appendLastName ||
        this.selectedType == TOOL_TYPE.signature ||
        this.selectedType == TOOL_TYPE.initial ||
        this.selectedType == TOOL_TYPE.date ||
        this.selectedType == TOOL_TYPE.star ||
        this.selectedType == TOOL_TYPE.text ||
        this.selectedType == null
      )
        return

      this.toolsDropdowm = [...this.toolsDropdowm, this.initialIcon]
      const storeInitialIcon = this.toolsDropdowm.find(
        (item) => item.type == this.selectedType
      )
      this.toolsDropdowm = this.toolsDropdowm.filter(
        (item) => item.type != this.selectedType
      )
      this.initialIcon = storeInitialIcon
      this.showDropDown = false
    },
    signAgreeChecked() {
      setTimeout(() => {
        this.$BUS.$emit('scroll-to-tools')
      }, 100)
    },
    'file.fileAction': function () {
      this.setSelectedType(null)
    },
    selectedToolType: function () {
      this.activeTool = this.selectedToolType == null ? null : this.activeTool
    },
    '$auth.user.initialURL': async function () {
      this.changeInitialToBase64()
    },
    '$auth.user.signatureURL': async function () {
      this.changeInitialToBase64()
    },
    "$store.getters.getActiveToolValue": function(){
       this.toolValue = this.$store.getters.getActiveToolValue
    },
    toolValue(val){
        this.isFocus && this.inputValue(val)
    },
    openTypeSignModal: function () {
      if (this.openTypeSignModal) {
        this.showSignatureModal = true
      }
    },
    openTypeInitialModal: function () {
      if (this.openTypeInitialModal) {
        this.showInitialsModal = true
      }
    },
  },
  mounted: function () {
    this.changeInitialToBase64()
    document.addEventListener('keydown', this.handleKeyDown)
    if (this.checkInitialDisplay) {
      this.initialResetIcon = this.resetDropdown.find((v) => v.type == 'clear')
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },
}
</script>

<style lang="scss" scoped>
.tools-container-wrapper {
  button {
    @apply p-2 flex justify-center items-center;
  }
}

// .tray-mode {}

// .tray-mode::before {
//   content: " ";
//   position: absolute;
//   background: white;
//   border: solid 2px #84C870;
//   width: 10px;
//   height: 10px;
//   z-index: 11;
//   transform: rotate(45deg);
//   margin-top: -20px;
// }
.drop-down-action {
  position: absolute;
  top: calc(100% + 5px);
  background-color: white;
  border-radius: 8px;
  left: 0px;
  z-index: 5;
  transition: 0.3s;
  overflow: hidden;
}
.turn-up {
  transition: 0.3s;
  transform: rotateX(180deg);
  @apply bg-paperdazgreen-300 text-white;
}
.turn-down {
  transition: 0.3s;
  transform: rotateX(0deg);
  @apply bg-white text-black;
}
.line-side::before {
  content: '';
  display: block;
  position: absolute;
  top: 10%;
  left: 0;
  height: 80%;
  width: 2px;
  @apply bg-slate-200;
}
.name_dropdown {
  @apply w-8 bg-white rounded-md overflow-hidden flex justify-between items-center;
}
.div_wrapper {
  width: calc(100% - 0px);
  @apply flex justify-center;
}
.tool {
  @apply mx-1 my-1;
}
.action-button_D {
  @apply w-[40px] h-[40px] rounded-full bg-paperdazgreen-300 text-white inline-flex justify-center items-center font-[600];
}
.action-button_A {
  @apply w-[40px] h-[40px] rounded-full bg-white inline-flex justify-center items-center font-[300];
}
.tools {
  @apply flex items-center bg-white px-3 py-1 rounded-md mx-2 my-2 w-[90px] justify-center;
}
.active {
  @apply bg-paperdazgreen-300 text-white;
}
</style>
