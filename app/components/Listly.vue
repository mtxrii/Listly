<template>
    <Page class="page" @loaded="onPageLoaded">
        <ActionBar title=" " flat="true"
            v-bind:class="{ completed: activeTabIndex == 1 }" />


        <BottomNavigation :selectedIndex="activeTabIndex"
            @selectedIndexChange="onTabChange">
            <TabStrip>
                <TabStripItem>
                    <Label text="To Do"></Label>
                    <Image :src="todoIcon" />
                </TabStripItem>
                <TabStripItem>
                    <Label text="Completed"></Label>
                    <Image :src="completedIcon" />
                </TabStripItem>
            </TabStrip>

            <TabContentItem>

                <GridLayout rows="auto, auto, *">

                    <Label row="0" class="header" text="My List" />
                    <TextField row="1" ref="taskInput"
                        v-model="textFieldValue" hint="Enter task..."
                        returnKeyType="done" @returnPress="onReturnPress" />


                    <ListView row="2" class="list-group" for="todo in todos">
                        <v-template>
                            <GridLayout columns="auto, *" class="list-entry">
                                <Label col="0"
                                    v-on:tap="onTodoCircleTap(todo)"
                                    class="circle" text=" " />
                                <Label col="1" v-on:tap="onTodoItemTap(todo)"
                                    :text="todo.name" textWrap="true" />
                            </GridLayout>
                        </v-template>
                    </ListView>

                </GridLayout>

            </TabContentItem>
            <TabContentItem>
                <GridLayout rows="auto, *">
                    <Label row="0" class="header completed"
                        text="Completed" />
                    <ListView row="1" class="list-group" for="done in dones">
                        <v-template>
                            <GridLayout columns="auto, *"
                                class="list-entry list-entry-completed">
                                <Label col="0"
                                    v-on:tap="onCompletedCircleTap(done)"
                                    class="circle" text="✓" />
                                <Label col="1"
                                    v-on:tap="onCompletedItemTap(done)"
                                    :text="done.name" textWrap="true" />
                            </GridLayout>
                        </v-template>
                    </ListView>
                </GridLayout>
            </TabContentItem>
        </BottomNavigation>

    </Page>
</template>

<script>
    const platform = require("tns-core-modules/platform");
    const frameModule = require("tns-core-modules/ui/frame");

    export default {
        methods: {
            onPageLoaded: function() {
                if (platform.isIOS) {
                    const navBar = frameModule.Frame.topmost().ios
                        .controller
                        .navigationBar;
                    navBar.barStyle = UIBarStyle.UIBarStyleBlack;
                    IQKeyboardManager.sharedManager().enableAutoToolbar =
                        false;
                }
            },

            onTodoItemTap: function(item) {
                const index = this.todos.indexOf(item);
                const cancel = "Cancel";
                const markCompleted = "Mark completed";
                const deleteForever = "Delete";

                action("What do you want to do with this task?", cancel, [
                    markCompleted,
                    deleteForever
                ]).then(result => {
                    switch (result) {
                        case markCompleted:
                            this.dones.unshift(item);
                            this.todos.splice(index, 1);
                            this.activeTabIndex = 1;
                            break;
                        case deleteForever:
                            this.todos.splice(index, 1);
                            break;
                        case cancel || undefined:
                            break;
                    }
                });
            },

            onTodoCircleTap: function(item) {
                const index = this.todos.indexOf(item);
                this.dones.unshift(item);
                this.todos.splice(index, 1);
                this.activeTabIndex = 1;
            },

            onCompletedItemTap: function(item) {
                const index = this.dones.indexOf(item);
                const cancel = "Cancel";
                const markUndone = "Mark incomplete";
                const deleteForever = "Delete";

                action("What do you want to do with this task?", cancel, [
                    markUndone,
                    deleteForever
                ]).then(result => {
                    switch (result) {
                        case markUndone:
                            this.todos.unshift(item);
                            this.dones.splice(index, 1);
                            this.activeTabIndex = 0;
                            break;
                        case deleteForever:
                            this.dones.splice(index, 1);
                            break;
                        case cancel || undefined:
                            break;
                    }
                });
            },

            onCompletedCircleTap: function(item) {
                const index = this.dones.indexOf(item);
                this.todos.unshift(item);
                this.dones.splice(index, 1);
                this.activeTabIndex = 0;
            },

            onReturnPress: function() {
                if (this.textFieldValue.trim() === "") {
                    this.$refs.taskInput.nativeView.focus();
                    return;
                }

                this.todos.unshift({
                    name: this.textFieldValue
                });
                this.textFieldValue = "";
            },

            onTabChange: function(tab) {
                this.activeTabIndex = tab.value;
            }
        },

        data() {
            return {
                todoIcon: platform.isIOS ? "~/./images/To-Do@3x.png" : "",
                completedIcon: platform.isIOS ?
                    "~/./images/Completed@3x.png" : "",

                todos: [{
                    name: "Example task"
                }],

                dones: [],

                activeTabIndex: 0,
                textFieldValue: ""
            };
        }
    };
</script>

<style scoped>
    ActionBar {
        background-color: #35495E;
    }

    .header {
        background-color: #35495E;
        color: white;
        font-size: 34;
        font-weight: 600;
        padding: 0 15 15 15;
        margin: 0;
    }

    .completed {
        background-color: #7742B8;
    }

    TextField {
        width: 100%;
        font-size: 17;
        color: black;
        placeholder-color: #C1C1C1;
        padding: 17;
        border-width: 0 0 1 0;
        border-color: #E0E0E0;
    }

    TabStripItem.tabstripitem {
        background-color: teal;
    }

    TabStripItem.tabstripitem:active {
        background-color: yellowgreen;
    }

    .list-entry {
        padding: 0 15;
        color: #7742B8;
    }

    .circle {
        width: 30;
        height: 30;
        padding: 0;
        color: #7742B8;
        font-size: 25;
        border-color: #7742B8;
        border-width: 2;
        border-radius: 50;
    }

    .list-entry .circle {
        margin: 0 10 0 0;
    }

    .list-entry Label {
        font-weight: bold;
        font-size: 17;
        vertical-align: middle;
        padding: 17 0;
        margin: 0;
    }

    .list-entry-completed .circle {
        color: white;
        background-color: #7742B8;
        text-align: center;
        padding: 0;
    }
</style>